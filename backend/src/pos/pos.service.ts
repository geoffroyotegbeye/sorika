import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegisterDto } from './dto/create-register.dto';
import { OpenSessionDto } from './dto/open-session.dto';
import { CloseSessionDto } from './dto/close-session.dto';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class PosService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // CAISSES (Cash Registers)
  // ============================================

  async createRegister(companyId: string, dto: CreateRegisterDto) {
    return this.prisma.cashRegister.create({
      data: {
        ...dto,
        companyId,
      },
    });
  }

  async getRegisters(companyId: string) {
    return this.prisma.cashRegister.findMany({
      where: { companyId },
      include: {
        _count: {
          select: { sessions: true, sales: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRegister(companyId: string, id: string) {
    const register = await this.prisma.cashRegister.findFirst({
      where: { id, companyId },
      include: {
        sessions: {
          take: 10,
          orderBy: { openedAt: 'desc' },
          include: {
            cashier: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
    });

    if (!register) {
      throw new NotFoundException('Caisse non trouvée');
    }

    return register;
  }

  async updateRegister(companyId: string, id: string, dto: Partial<CreateRegisterDto>) {
    const register = await this.prisma.cashRegister.findFirst({
      where: { id, companyId },
    });

    if (!register) {
      throw new NotFoundException('Caisse non trouvée');
    }

    return this.prisma.cashRegister.update({
      where: { id },
      data: dto,
    });
  }

  async deleteRegister(companyId: string, id: string) {
    const register = await this.prisma.cashRegister.findFirst({
      where: { id, companyId },
    });

    if (!register) {
      throw new NotFoundException('Caisse non trouvée');
    }

    return this.prisma.cashRegister.delete({
      where: { id },
    });
  }

  // ============================================
  // SESSIONS DE CAISSE
  // ============================================

  async openSession(companyId: string, dto: OpenSessionDto) {
    // Vérifier qu'il n'y a pas déjà une session ouverte pour cette caisse
    const existingSession = await this.prisma.cashSession.findFirst({
      where: {
        registerId: dto.registerId,
        status: 'OPEN',
        companyId,
      },
    });

    if (existingSession) {
      throw new BadRequestException('Une session est déjà ouverte pour cette caisse');
    }

    // Vérifier que la caisse existe et appartient à cette entreprise
    const register = await this.prisma.cashRegister.findFirst({
      where: { id: dto.registerId, companyId },
    });
    if (!register) {
      throw new NotFoundException('Caisse introuvable');
    }

    // Vérifier le caissier si fourni
    if (dto.cashierId) {
      const cashier = await this.prisma.employee.findFirst({
        where: { id: dto.cashierId, companyId },
      });
      if (!cashier) {
        throw new NotFoundException('Caissier introuvable');
      }
    }

    return this.prisma.cashSession.create({
      data: {
        registerId:    dto.registerId,
        ...(dto.cashierId ? { cashierId: dto.cashierId } : {}),
        openingAmount: dto.openingAmount,
        companyId,
        status: 'OPEN',
      },
      include: {
        register: true,
        cashier: {
          select: { firstName: true, lastName: true },
        },
      },
    });
  }

  async closeSession(companyId: string, sessionId: string, dto: CloseSessionDto) {
    const session = await this.prisma.cashSession.findFirst({
      where: { id: sessionId, companyId },
      include: {
        sales: {
          where: { status: 'COMPLETED' },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Session non trouvée');
    }

    if (session.status === 'CLOSED') {
      throw new BadRequestException('Cette session est déjà fermée');
    }

    // Calculer le montant attendu
    const totalSales = session.sales.reduce((sum, sale) => sum + sale.total, 0);
    const expectedAmount = session.openingAmount + totalSales;
    const difference = dto.closingAmount - expectedAmount;

    return this.prisma.cashSession.update({
      where: { id: sessionId },
      data: {
        closingAmount: dto.closingAmount,
        expectedAmount,
        difference,
        status: 'CLOSED',
        closedAt: new Date(),
        notes: dto.notes,
      },
      include: {
        register: true,
        cashier: {
          select: { firstName: true, lastName: true },
        },
      },
    });
  }

  async getSessions(companyId: string) {
    return this.prisma.cashSession.findMany({
      where: { companyId },
      include: {
        register: true,
        cashier: {
          select: { firstName: true, lastName: true },
        },
        _count: {
          select: { sales: true },
        },
      },
      orderBy: { openedAt: 'desc' },
    });
  }

  async getSession(companyId: string, sessionId: string) {
    const session = await this.prisma.cashSession.findFirst({
      where: { id: sessionId, companyId },
      include: {
        register: true,
        cashier: {
          select: { firstName: true, lastName: true },
        },
        sales: {
          include: {
            items: {
              include: {
                product: {
                  select: { name: true, sku: true },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Session non trouvée');
    }

    return session;
  }

  async getCurrentSession(companyId: string, registerId: string) {
    return this.prisma.cashSession.findFirst({
      where: {
        registerId,
        companyId,
        status: 'OPEN',
      },
      include: {
        register: true,
        cashier: {
          select: { firstName: true, lastName: true },
        },
      },
    });
  }

  // ============================================
  // VENTES
  // ============================================

  async createSale(companyId: string, dto: CreateSaleDto) {
    // Vérifier que la session est ouverte
    const session = await this.prisma.cashSession.findFirst({
      where: { id: dto.sessionId, companyId, status: 'OPEN' },
    });

    if (!session) {
      throw new BadRequestException('Session de caisse non trouvée ou fermée');
    }

    // Générer le numéro de vente
    const lastSale = await this.prisma.sale.findFirst({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });

    const year = new Date().getFullYear();
    const lastNumber = lastSale?.saleNumber.match(/POS-\d+-(\d+)/)?.[1] || '0';
    const nextNumber = (parseInt(lastNumber) + 1).toString().padStart(5, '0');
    const saleNumber = `POS-${year}-${nextNumber}`;

    // Calculer les totaux
    const taxPercent = 18; // TVA 18%
    let subtotal = 0;

    // Récupérer les produits pour vérifier le stock et les prix
    const productIds = dto.items.map((item) => item.productId);
    const products = await this.prisma.inventoryProduct.findMany({
      where: { id: { in: productIds }, companyId },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Vérifier le stock et calculer les totaux
    for (const item of dto.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new NotFoundException(`Produit ${item.productId} non trouvé`);
      }

      if (product.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Stock insuffisant pour ${product.name} (disponible: ${product.stockQuantity})`,
        );
      }

      const itemSubtotal = item.quantity * item.unitPrice - (item.discount || 0);
      subtotal += itemSubtotal;
    }

    // Appliquer la remise globale
    const discountAmount = dto.discountPercent
      ? (subtotal * dto.discountPercent) / 100
      : 0;
    const subtotalAfterDiscount = subtotal - discountAmount;

    // Calculer la TVA
    const taxAmount = (subtotalAfterDiscount * taxPercent) / 100;
    const total = subtotalAfterDiscount + taxAmount;

    // Calculer la monnaie
    const changeAmount = dto.amountPaid - total;

    if (changeAmount < 0) {
      throw new BadRequestException('Montant payé insuffisant');
    }

    // Créer la vente avec transaction
    const sale = await this.prisma.$transaction(async (tx) => {
      // Créer la vente
      const newSale = await tx.sale.create({
        data: {
          saleNumber,
          registerId: dto.registerId,
          sessionId: dto.sessionId,
          cashierId: dto.cashierId,
          customerId: dto.customerId,
          subtotal,
          discountAmount,
          discountPercent: dto.discountPercent || 0,
          taxAmount,
          taxPercent,
          total,
          paymentMethod: dto.paymentMethod,
          amountPaid: dto.amountPaid,
          changeAmount,
          status: 'COMPLETED',
          notes: dto.notes,
          companyId,
        },
      });

      // Créer les lignes de vente et déduire le stock
      for (const item of dto.items) {
        const product = productMap.get(item.productId)!;
        const itemSubtotal = item.quantity * item.unitPrice - (item.discount || 0);
        const itemTax = (itemSubtotal * taxPercent) / 100;
        const itemTotal = itemSubtotal + itemTax;

        // Créer la ligne de vente
        await tx.saleItem.create({
          data: {
            saleId: newSale.id,
            productId: item.productId,
            productName: product.name,
            productSku: product.sku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            taxPercent,
            subtotal: itemSubtotal,
            total: itemTotal,
          },
        });

        // Déduire le stock
        const newStock = product.stockQuantity - item.quantity;
        await tx.inventoryProduct.update({
          where: { id: item.productId },
          data: { stockQuantity: newStock },
        });

        // Créer le mouvement de stock
        await tx.stockMovement.create({
          data: {
            type: 'OUT',
            quantity: item.quantity,
            reason: `Vente POS ${saleNumber}`,
            reference: saleNumber,
            productId: item.productId,
            stockBefore: product.stockQuantity,
            stockAfter: newStock,
            unitCost: product.costPrice || 0,
            totalCost: (product.costPrice || 0) * item.quantity,
            companyId,
          },
        });

        // Vérifier les alertes de stock
        if (product.minStock && newStock <= product.minStock) {
          // Créer ou mettre à jour l'alerte
          const existingAlert = await tx.stockAlert.findFirst({
            where: {
              productId: item.productId,
              type: newStock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
              isResolved: false,
            },
          });

          if (!existingAlert) {
            await tx.stockAlert.create({
              data: {
                type: newStock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
                message:
                  newStock === 0
                    ? `Stock épuisé pour ${product.name}`
                    : `Stock bas pour ${product.name} (${newStock} restant)`,
                productId: item.productId,
                companyId,
              },
            });
          }
        }
      }

      // Créer les paiements si paiement mixte
      if (dto.paymentMethod === 'MIXED' && dto.payments) {
        for (const payment of dto.payments) {
          await tx.salePayment.create({
            data: {
              saleId: newSale.id,
              method: payment.method,
              amount: payment.amount,
              reference: payment.reference,
            },
          });
        }
      }

      return newSale;
    });

    // Retourner la vente avec les détails
    return this.getSale(companyId, sale.id);
  }

  async getSales(companyId: string, filters?: {
    registerId?: string;
    sessionId?: string;
    cashierId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = { companyId };

    if (filters) {
      if (filters.registerId) where.registerId = filters.registerId;
      if (filters.sessionId) where.sessionId = filters.sessionId;
      if (filters.cashierId) where.cashierId = filters.cashierId;
      if (filters.status) where.status = filters.status;
      if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate) where.createdAt.gte = filters.startDate;
        if (filters.endDate) where.createdAt.lte = filters.endDate;
      }
    }

    return this.prisma.sale.findMany({
      where,
      include: {
        register: { select: { name: true } },
        cashier: { select: { firstName: true, lastName: true } },
        customer: { select: { firstName: true, lastName: true, email: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSale(companyId: string, saleId: string) {
    const sale = await this.prisma.sale.findFirst({
      where: { id: saleId, companyId },
      include: {
        register: true,
        session: true,
        cashier: {
          select: { firstName: true, lastName: true },
        },
        customer: {
          select: { firstName: true, lastName: true, email: true, phone: true },
        },
        items: {
          include: {
            product: {
              select: { name: true, sku: true, imageUrl: true },
            },
          },
        },
        payments: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Vente non trouvée');
    }

    return sale;
  }

  // ============================================
  // RAPPORTS
  // ============================================

  async getDashboard(companyId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Ventes du jour
    const todaySales = await this.prisma.sale.findMany({
      where: {
        companyId,
        status: 'COMPLETED',
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const todayTransactions = todaySales.length;
    const averageBasket = todayTransactions > 0 ? todayRevenue / todayTransactions : 0;

    // Sessions ouvertes
    const openSessions = await this.prisma.cashSession.findMany({
      where: {
        companyId,
        status: 'OPEN',
      },
      include: {
        register: true,
        cashier: {
          select: { firstName: true, lastName: true },
        },
        _count: {
          select: { sales: true },
        },
      },
    });

    // Top produits du jour
    const topProducts = await this.prisma.saleItem.groupBy({
      by: ['productId'],
      where: {
        sale: {
          companyId,
          status: 'COMPLETED',
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      },
      _sum: {
        quantity: true,
        total: true,
      },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: 5,
    });

    // Récupérer les détails des produits
    const productIds = topProducts.map((p) => p.productId);
    const products = await this.prisma.inventoryProduct.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, sku: true, imageUrl: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    const topProductsWithDetails = topProducts.map((item) => ({
      product: productMap.get(item.productId),
      quantitySold: item._sum.quantity || 0,
      revenue: item._sum.total || 0,
    }));

    return {
      today: {
        revenue: todayRevenue,
        transactions: todayTransactions,
        averageBasket,
      },
      openSessions,
      topProducts: topProductsWithDetails,
    };
  }
}
