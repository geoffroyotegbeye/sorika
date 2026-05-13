import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EcommerceService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== CARTS ====================

  async getOrCreateCart(companyId: string, userId?: string, sessionId?: string) {
    // Chercher un panier actif pour cet utilisateur/session
    const where: Prisma.CartWhereInput = {
      companyId,
      isActive: true,
      ...(userId ? { userId } : { sessionId }),
    };

    let cart = await this.prisma.cart.findFirst({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          companyId,
          userId,
          sessionId,
          isActive: true,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return cart;
  }

  async addToCart(companyId: string, productId: string, quantity: number, userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(companyId, userId, sessionId);
    const product = await this.prisma.inventoryProduct.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    if (product.stockQuantity < quantity) {
      throw new BadRequestException('Stock insuffisant');
    }

    // Vérifier si l'article existe déjà dans le panier
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      // Mettre à jour la quantité
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          unitPrice: product.salePrice, // Mettre à jour le prix au cas où
        },
      });
    } else {
      // Créer un nouvel article
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          unitPrice: product.salePrice,
          companyId,
        },
      });
    }

    return this.getOrCreateCart(companyId, userId, sessionId);
  }

  async updateCartItemQuantity(cartItemId: string, quantity: number, userId?: string) {
    if (quantity < 1) {
      throw new BadRequestException('Quantité invalide');
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) {
      throw new NotFoundException('Article non trouvé');
    }

    // Vérifier l'accès
    if (userId && cartItem.cart.userId !== userId) {
      throw new NotFoundException('Panier non trouvé');
    }

    // Vérifier le stock
    const product = await this.prisma.inventoryProduct.findUnique({
      where: { id: cartItem.productId },
    });
    if (product && product.stockQuantity < quantity) {
      throw new BadRequestException('Stock insuffisant');
    }

    await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return this.getOrCreateCart(cartItem.cart.companyId, userId);
  }

  async removeFromCart(cartItemId: string, userId?: string) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) {
      throw new NotFoundException('Article non trouvé');
    }

    if (userId && cartItem.cart.userId !== userId) {
      throw new NotFoundException('Panier non trouvé');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return this.getOrCreateCart(cartItem.cart.companyId, userId);
  }

  async clearCart(companyId: string, userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(companyId, userId, sessionId);
    
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return this.getOrCreateCart(companyId, userId, sessionId);
  }

  // ==================== ORDERS ====================

  async createOrder(companyId: string, orderData: {
    userId?: string;
    customer: any;
    items: { productId: string; quantity: number; unitPrice: number; discount?: number }[];
    paymentMethod: string;
    shippingMethod?: string;
    shippingCost?: number;
    billingAddress?: any;
    shippingAddress?: any;
    customerNotes?: string;
    couponCode?: string;
  }) {
    const { items, customer, paymentMethod, ...rest } = orderData;

    // Calculer les totaux
    let subtotal = 0;
    let taxAmount = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = await this.prisma.inventoryProduct.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Produit ${item.productId} non trouvé`);
      }

      if (product.stockQuantity < item.quantity) {
        throw new BadRequestException(`Stock insuffisant pour ${product.name}`);
      }

      const itemTotal = (item.unitPrice * item.quantity) - (item.discount || 0);
      subtotal += itemTotal;

      orderItems.push({
        productId: item.productId,
        productName: product.name,
        productSku: product.sku,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        discount: item.discount || 0,
        total: itemTotal,
        companyId,
      });
    }

    // TVA (18% par défaut)
    taxAmount = subtotal * 0.18;

    // Appliquer coupon si présent
    let discountAmount = 0;
    if (orderData.couponCode) {
      const coupon = await this.prisma.coupon.findFirst({
        where: {
          code: orderData.couponCode,
          companyId,
          isActive: true,
          validFrom: { lte: new Date() },
          validUntil: { gte: new Date() },
          usageLimit: { not: { lte: 0 } },
        },
      });

      if (coupon) {
        if (coupon.minPurchase && subtotal < coupon.minPurchase) {
          throw new BadRequestException(`Montant minimum d'achat non atteint pour ce coupon`);
        }

        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscount);
          }
        } else if (coupon.discountType === 'FIXED') {
          discountAmount = coupon.discountValue;
        }

        // Incrémenter le compteur d'utilisation
        await this.prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      } else {
        throw new NotFoundException('Code promo invalide');
      }
    }

    const total = subtotal + taxAmount + (orderData.shippingCost || 0) - discountAmount;

    // Générer un numéro de commande unique
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;

    // Créer la commande
    const order = await this.prisma.order.create({
      data: {
        companyId,
        userId: orderData.userId,
        customer: customer,
        orderNumber,
        status: 'PENDING',
        paymentMethod,
        paymentStatus: 'PENDING',
        shippingMethod: orderData.shippingMethod,
        shippingCost: orderData.shippingCost || 0,
        billingAddress: orderData.billingAddress,
        shippingAddress: orderData.shippingAddress,
        subtotal,
        taxAmount,
        discountAmount,
        shippingAmount: orderData.shippingCost || 0,
        total,
        customerNotes: orderData.customerNotes,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Vider le panier après commande
    const cart = await this.prisma.cart.findFirst({
      where: {
        companyId,
        ...(orderData.userId ? { userId: orderData.userId } : { sessionId: orderData.customer?.sessionId }),
        isActive: true,
      },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
      await this.prisma.cart.update({
        where: { id: cart.id },
        data: { isCheckout: false },
      });
    }

    return order;
  }

  async getOrders(companyId: string, filters?: {
    status?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const where: Prisma.OrderWhereInput = { companyId };

    if (filters?.status) {
      where.status = filters.status as any;
    }
    if (filters?.userId) {
      where.userId = filters.userId;
    }
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        (where.createdAt as any).gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        (where.createdAt as any).lte = new Date(filters.endDate);
      }
    }

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(orderId: string, status: string, companyId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, companyId },
    });

    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }

    // Si marquée comme livrée, enregistrer la date
    const data: any = { status };
    if (status === 'DELIVERED') {
      data.deliveredAt = new Date();
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data,
    });
  }

  // ==================== COUPONS ====================

  async validateCoupon(companyId: string, code: string, subtotal: number) {
    const coupon = await this.prisma.coupon.findFirst({
      where: {
        code,
        companyId,
        isActive: true,
        validFrom: { lte: new Date() },
        validUntil: { gte: new Date() },
      },
    });

    if (!coupon) {
      return { valid: false, message: 'Code promo invalide' };
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, message: 'Code promo épuisé' };
    }

    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      return { valid: false, message: `Montant minimum d'achat: ${coupon.minPurchase} XOF` };
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else if (coupon.discountType === 'FIXED') {
      discountAmount = coupon.discountValue;
    }

    return {
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        description: coupon.description,
      },
    };
  }

  // ==================== REVIEWS ====================

  async createReview(companyId: string, productId: string, reviewData: {
    userId?: string;
    authorName?: string;
    authorEmail?: string;
    rating: number;
    title?: string;
    comment?: string;
  }) {
    const product = await this.prisma.inventoryProduct.findFirst({
      where: { id: productId, companyId },
    });

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    // Vérifier si l'utilisateur a déjà laissé un avis
    if (reviewData.userId) {
      const existing = await this.prisma.review.findFirst({
        where: { productId, userId: reviewData.userId },
      });

      if (existing) {
        throw new BadRequestException('Vous avez déjà laissé un avis pour ce produit');
      }
    }

    return this.prisma.review.create({
      data: {
        productId,
        userId: reviewData.userId,
        authorName: reviewData.authorName,
        authorEmail: reviewData.authorEmail,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        isApproved: false, // Modération par défaut
        companyId,
      },
    });
  }

  async getProductReviews(productId: string, companyId: string) {
    return this.prisma.review.findMany({
      where: {
        productId,
        companyId,
        isApproved: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ==================== STATS ====================

  async getDashboardStats(companyId: string) {
    const [totalOrders, pendingOrders, totalRevenue, avgOrderValue, topProducts] = await Promise.all([
      this.prisma.order.count({ where: { companyId } }),
      this.prisma.order.count({ where: { companyId, status: 'PENDING' } }),
      this.prisma.order.aggregate({
        where: { companyId, paymentStatus: 'PAID' },
        _sum: { total: true },
      }),
      this.prisma.order.aggregate({
        where: { companyId, paymentStatus: 'PAID' },
        _avg: { total: true },
      }),
      this.prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: {
            companyId,
            paymentStatus: 'PAID',
          },
        },
        _sum: { quantity: true, total: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      avgOrderValue: avgOrderValue._avg.total || 0,
      topProducts,
    };
  }
}
