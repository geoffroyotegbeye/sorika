import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';
import { CreateStockMovementDto } from './dto/stock-movement.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Statistiques ────────────────────────────────────────────────────────────

  async getStats(companyId: string) {
    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
      totalStockValue,
      categories,
      recentMovements,
    ] = await Promise.all([
      // Total produits
      this.prisma.inventoryProduct.count({ where: { companyId } }),
      
      // Produits actifs
      this.prisma.inventoryProduct.count({ where: { companyId, isActive: true } }),
      
      // Produits en stock bas
      this.prisma.inventoryProduct.count({
        where: {
          companyId,
          isActive: true,
          minStock: { not: null },
          stockQuantity: { lte: this.prisma.inventoryProduct.fields.minStock },
        },
      }),
      
      // Produits en rupture
      this.prisma.inventoryProduct.count({
        where: { companyId, isActive: true, stockQuantity: 0 },
      }),
      
      // Valeur totale du stock
      this.prisma.inventoryProduct.aggregate({
        where: { companyId, isActive: true },
        _sum: {
          stockQuantity: true,
        },
      }).then(async (result) => {
        const products = await this.prisma.inventoryProduct.findMany({
          where: { companyId, isActive: true },
          select: { stockQuantity: true, costPrice: true, salePrice: true },
        });
        
        const costValue = products.reduce((sum, p) => sum + (p.stockQuantity * (p.costPrice || 0)), 0);
        const saleValue = products.reduce((sum, p) => sum + (p.stockQuantity * p.salePrice), 0);
        
        return { costValue, saleValue };
      }),
      
      // Nombre de catégories
      this.prisma.productCategory.count({ where: { companyId } }),
      
      // Mouvements récents
      this.prisma.stockMovement.findMany({
        where: { companyId },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { name: true, sku: true } },
        },
      }),
    ]);

    return {
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
      totalStockValue,
      categories,
      recentMovements,
    };
  }

  // ─── Catégories ──────────────────────────────────────────────────────────────

  async listCategories(companyId: string) {
    return this.prisma.productCategory.findMany({
      where: { companyId },
      include: {
        parent: true,
        children: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(companyId: string, dto: CreateCategoryDto) {
    // Vérifier que le parent existe si fourni
    if (dto.parentId) {
      const parent = await this.prisma.productCategory.findFirst({
        where: { id: dto.parentId, companyId },
      });
      if (!parent) {
        throw new NotFoundException('Catégorie parente non trouvée');
      }
    }

    return this.prisma.productCategory.create({
      data: {
        name: dto.name,
        description: dto.description,
        // Convertir chaîne vide en null pour Prisma
        parentId: dto.parentId || null,
        companyId,
      },
      include: {
        parent: true,
        _count: { select: { products: true } },
      },
    });
  }

  async updateCategory(companyId: string, categoryId: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.productCategory.findFirst({
      where: { id: categoryId, companyId },
    });

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    // Vérifier que le parent existe si fourni
    if (dto.parentId) {
      const parent = await this.prisma.productCategory.findFirst({
        where: { id: dto.parentId, companyId },
      });
      if (!parent) {
        throw new NotFoundException('Catégorie parente non trouvée');
      }
      
      // Empêcher les boucles (une catégorie ne peut pas être son propre parent)
      if (dto.parentId === categoryId) {
        throw new BadRequestException('Une catégorie ne peut pas être son propre parent');
      }
    }

    return this.prisma.productCategory.update({
      where: { id: categoryId },
      data: {
        name: dto.name,
        description: dto.description,
        // Convertir chaîne vide en null pour Prisma
        parentId: dto.parentId || null,
      },
      include: {
        parent: true,
        _count: { select: { products: true } },
      },
    });
  }

  async deleteCategory(companyId: string, categoryId: string) {
    const category = await this.prisma.productCategory.findFirst({
      where: { id: categoryId, companyId },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      throw new NotFoundException('Catégorie non trouvée');
    }

    if (category._count.products > 0) {
      throw new BadRequestException('Impossible de supprimer une catégorie contenant des produits');
    }

    await this.prisma.productCategory.delete({ where: { id: categoryId } });
    return { message: 'Catégorie supprimée' };
  }

  // ─── Produits ────────────────────────────────────────────────────────────────

  async listProducts(companyId: string, filters?: {
    categoryId?: string;
    isActive?: boolean;
    search?: string;
    lowStock?: boolean;
  }) {
    const where: any = { companyId };

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { barcode: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.lowStock) {
      where.AND = [
        { minStock: { not: null } },
        { stockQuantity: { lte: this.prisma.inventoryProduct.fields.minStock } },
      ];
    }

    return this.prisma.inventoryProduct.findMany({
      where,
      include: {
        category: true,
        _count: { select: { movements: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getProduct(companyId: string, productId: string) {
    const product = await this.prisma.inventoryProduct.findFirst({
      where: { id: productId, companyId },
      include: {
        category: true,
        movements: {
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
        stockAlerts: {
          where: { isResolved: false },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    return product;
  }

  async createProduct(companyId: string, dto: CreateProductDto) {
    // Vérifier que la catégorie existe si fournie
    if (dto.categoryId) {
      const category = await this.prisma.productCategory.findFirst({
        where: { id: dto.categoryId, companyId },
      });
      if (!category) {
        throw new NotFoundException('Catégorie non trouvée');
      }
    }

    // Vérifier l'unicité du SKU si fourni
    if (dto.sku) {
      const existing = await this.prisma.inventoryProduct.findFirst({
        where: { sku: dto.sku, companyId },
      });
      if (existing) {
        throw new BadRequestException('Ce SKU existe déjà');
      }
    }

    // Vérifier l'unicité du code-barres si fourni
    if (dto.barcode) {
      const existing = await this.prisma.inventoryProduct.findFirst({
        where: { barcode: dto.barcode, companyId },
      });
      if (existing) {
        throw new BadRequestException('Ce code-barres existe déjà');
      }
    }

    const product = await this.prisma.inventoryProduct.create({
      data: {
        name: dto.name,
        description: dto.description,
        sku: dto.sku,
        barcode: dto.barcode,
        // Convertir chaîne vide en null pour Prisma
        categoryId: dto.categoryId || null,
        costPrice: dto.costPrice,
        salePrice: dto.salePrice,
        stockQuantity: dto.stockQuantity || 0,
        minStock: dto.minStock,
        unit: dto.unit,
        imageUrl: dto.imageUrl,
        companyId,
      },
      include: {
        category: true,
      },
    });

    // Créer une alerte si stock bas
    await this.checkAndCreateStockAlert(product);

    return product;
  }

  async updateProduct(companyId: string, productId: string, dto: UpdateProductDto) {
    const product = await this.prisma.inventoryProduct.findFirst({
      where: { id: productId, companyId },
    });

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    // Vérifier la catégorie si fournie
    if (dto.categoryId) {
      const category = await this.prisma.productCategory.findFirst({
        where: { id: dto.categoryId, companyId },
      });
      if (!category) {
        throw new NotFoundException('Catégorie non trouvée');
      }
    }

    // Vérifier l'unicité du SKU si modifié
    if (dto.sku && dto.sku !== product.sku) {
      const existing = await this.prisma.inventoryProduct.findFirst({
        where: { sku: dto.sku, companyId, id: { not: productId } },
      });
      if (existing) {
        throw new BadRequestException('Ce SKU existe déjà');
      }
    }

    // Vérifier l'unicité du code-barres si modifié
    if (dto.barcode && dto.barcode !== product.barcode) {
      const existing = await this.prisma.inventoryProduct.findFirst({
        where: { barcode: dto.barcode, companyId, id: { not: productId } },
      });
      if (existing) {
        throw new BadRequestException('Ce code-barres existe déjà');
      }
    }

    const updated = await this.prisma.inventoryProduct.update({
      where: { id: productId },
      data: {
        ...dto,
        // Convertir chaîne vide en null pour Prisma
        categoryId: dto.categoryId || null,
      },
      include: {
        category: true,
      },
    });

    // Vérifier les alertes de stock
    await this.checkAndCreateStockAlert(updated);

    return updated;
  }

  async deleteProduct(companyId: string, productId: string) {
    const product = await this.prisma.inventoryProduct.findFirst({
      where: { id: productId, companyId },
    });

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    await this.prisma.inventoryProduct.delete({ where: { id: productId } });
    return { message: 'Produit supprimé' };
  }

  // ─── Mouvements de stock ─────────────────────────────────────────────────────

  async listMovements(companyId: string, filters?: {
    productId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const where: any = { companyId };

    if (filters?.productId) {
      where.productId = filters.productId;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.createdAt.lte = new Date(filters.endDate);
      }
    }

    return this.prisma.stockMovement.findMany({
      where,
      include: {
        product: { select: { name: true, sku: true, unit: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createMovement(
    companyId: string,
    productId: string,
    dto: CreateStockMovementDto,
    userId?: string,
  ) {
    const product = await this.prisma.inventoryProduct.findFirst({
      where: { id: productId, companyId },
    });

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    const stockBefore = product.stockQuantity;
    let stockAfter = stockBefore;

    // Calculer le nouveau stock selon le type de mouvement
    if (dto.type === 'IN') {
      stockAfter = stockBefore + dto.quantity;
    } else if (dto.type === 'OUT') {
      stockAfter = stockBefore - dto.quantity;
      if (stockAfter < 0) {
        throw new BadRequestException('Stock insuffisant');
      }
    } else if (dto.type === 'ADJUSTMENT') {
      stockAfter = dto.quantity; // Ajustement = nouvelle valeur absolue
    }

    // Calculer le coût total
    const totalCost = dto.unitCost ? dto.quantity * dto.unitCost : null;

    // Créer le mouvement et mettre à jour le stock en transaction
    const [movement] = await this.prisma.$transaction([
      this.prisma.stockMovement.create({
        data: {
          ...dto,
          productId,
          companyId,
          stockBefore,
          stockAfter,
          totalCost,
          createdById: userId,
        },
        include: {
          product: { select: { name: true, sku: true, unit: true } },
        },
      }),
      this.prisma.inventoryProduct.update({
        where: { id: productId },
        data: { stockQuantity: stockAfter },
      }),
    ]);

    // Vérifier les alertes de stock
    const updatedProduct = await this.prisma.inventoryProduct.findUnique({
      where: { id: productId },
    });
    if (updatedProduct) {
      await this.checkAndCreateStockAlert(updatedProduct);
    }

    return movement;
  }

  // ─── Alertes de stock ────────────────────────────────────────────────────────

  async listAlerts(companyId: string, filters?: { isResolved?: boolean }) {
    const where: any = { companyId };

    if (filters?.isResolved !== undefined) {
      where.isResolved = filters.isResolved;
    }

    return this.prisma.stockAlert.findMany({
      where,
      include: {
        product: { select: { name: true, sku: true, stockQuantity: true, minStock: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolveAlert(companyId: string, alertId: string) {
    const alert = await this.prisma.stockAlert.findFirst({
      where: { id: alertId, companyId },
    });

    if (!alert) {
      throw new NotFoundException('Alerte non trouvée');
    }

    return this.prisma.stockAlert.update({
      where: { id: alertId },
      data: {
        isResolved: true,
        resolvedAt: new Date(),
      },
    });
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private async checkAndCreateStockAlert(product: any) {
    // Résoudre les anciennes alertes
    await this.prisma.stockAlert.updateMany({
      where: {
        productId: product.id,
        isResolved: false,
      },
      data: {
        isResolved: true,
        resolvedAt: new Date(),
      },
    });

    // Créer une nouvelle alerte si nécessaire
    let alertType: string | null = null;
    let message: string | null = null;

    if (product.stockQuantity === 0) {
      alertType = 'OUT_OF_STOCK';
      message = `Le produit "${product.name}" est en rupture de stock`;
    } else if (product.minStock && product.stockQuantity <= product.minStock) {
      alertType = 'LOW_STOCK';
      message = `Le produit "${product.name}" est en stock bas (${product.stockQuantity} ${product.unit})`;
    } else if (product.maxStock && product.stockQuantity > product.maxStock) {
      alertType = 'OVERSTOCK';
      message = `Le produit "${product.name}" est en surstock (${product.stockQuantity} ${product.unit})`;
    }

    if (alertType && message) {
      await this.prisma.stockAlert.create({
        data: {
          type: alertType,
          message,
          productId: product.id,
          companyId: product.companyId,
        },
      });
    }
  }
}
