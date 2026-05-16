import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // Helper pour récupérer l'ID de l'organisation
  private async getOrganizationId(slugOrId: string): Promise<string> {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(slugOrId)) {
      const organization = await this.prisma.company.findUnique({
        where: { id: slugOrId },
        select: { id: true },
      });
      if (!organization) {
        throw new NotFoundException('Organisation non trouvée');
      }
      return slugOrId;
    }

    const organization = await this.prisma.company.findUnique({
      where: { slug: slugOrId },
      select: { id: true },
    });

    if (!organization) {
      throw new NotFoundException('Organisation non trouvée');
    }

    return organization.id;
  }

  // Dashboard général avec KPIs
  async getDashboard(companyId: string, period: string = 'month') {
    const organizationId = await this.getOrganizationId(companyId);

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case 'month':
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // Ventes totales
    const sales = await this.prisma.sale.aggregate({
      where: {
        companyId: organizationId,
        createdAt: { gte: startDate },
      },
      _sum: { total: true },
      _count: true,
    });

    // Factures
    const invoices = await this.prisma.invoice.aggregate({
      where: {
        companyId: organizationId,
        createdAt: { gte: startDate },
      },
      _sum: { total: true, amountPaid: true },
      _count: true,
    });

    // Clients CRM
    const contacts = await this.prisma.contact.count({
      where: {
        organizationId,
        createdAt: { gte: startDate },
      },
    });

    // Opportunités
    const opportunities = await this.prisma.opportunity.aggregate({
      where: {
        organizationId,
        createdAt: { gte: startDate },
      },
      _sum: { amount: true },
      _count: true,
    });

    const opportunitiesWon = await this.prisma.opportunity.count({
      where: {
        organizationId,
        stage: 'WON',
        actualCloseDate: { gte: startDate },
      },
    });

    // Produits en stock
    const products = await this.prisma.inventoryProduct.count({
      where: {
        companyId: organizationId,
        isActive: true,
      },
    });

    const lowStockProducts = await this.prisma.inventoryProduct.count({
      where: {
        companyId: organizationId,
        isActive: true,
        stockQuantity: { lte: this.prisma.inventoryProduct.fields.minStock },
      },
    });

    // Employés
    const employees = await this.prisma.employee.count({
      where: {
        companyId: organizationId,
        isActive: true,
      },
    });

    return {
      period,
      sales: {
        total: sales._sum.total || 0,
        count: sales._count,
      },
      invoices: {
        total: invoices._sum.total || 0,
        paid: invoices._sum.amountPaid || 0,
        count: invoices._count,
      },
      crm: {
        contacts,
        opportunities: opportunities._count,
        opportunitiesValue: opportunities._sum.amount || 0,
        opportunitiesWon,
      },
      inventory: {
        products,
        lowStockProducts,
      },
      hr: {
        employees,
      },
    };
  }

  // Statistiques de ventes détaillées
  async getSalesAnalytics(
    companyId: string,
    startDate?: string,
    endDate?: string,
  ) {
    const organizationId = await this.getOrganizationId(companyId);

    const where: any = { companyId: organizationId };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const sales = await this.prisma.sale.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        cashier: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const averageTicket = sales.length > 0 ? totalRevenue / sales.length : 0;

    // Ventes par méthode de paiement
    const paymentMethods = sales.reduce(
      (acc, sale) => {
        acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalRevenue,
      totalSales: sales.length,
      averageTicket,
      paymentMethods,
      sales: sales.slice(0, 20), // Dernières 20 ventes
    };
  }

  // Statistiques CRM
  async getCRMAnalytics(companyId: string) {
    const organizationId = await this.getOrganizationId(companyId);

    // Contacts par statut
    const contactsByStatus = await this.prisma.contact.groupBy({
      by: ['status'],
      where: { organizationId },
      _count: true,
    });

    // Opportunités par étape
    const opportunitiesByStage = await this.prisma.opportunity.groupBy({
      by: ['stage'],
      where: { organizationId },
      _count: true,
      _sum: { amount: true },
    });

    // Taux de conversion
    const totalOpportunities = await this.prisma.opportunity.count({
      where: { organizationId },
    });

    const wonOpportunities = await this.prisma.opportunity.count({
      where: { organizationId, stage: 'WON' },
    });

    const conversionRate =
      totalOpportunities > 0 ? (wonOpportunities / totalOpportunities) * 100 : 0;

    return {
      contactsByStatus,
      opportunitiesByStage,
      conversionRate,
      totalOpportunities,
      wonOpportunities,
    };
  }

  // Statistiques Inventaire
  async getInventoryAnalytics(companyId: string) {
    const organizationId = await this.getOrganizationId(companyId);

    const products = await this.prisma.inventoryProduct.findMany({
      where: { companyId: organizationId, isActive: true },
      include: {
        category: true,
      },
    });

    const totalValue = products.reduce(
      (sum, p) => sum + p.stockQuantity * (p.costPrice || 0),
      0,
    );

    const lowStockProducts = products.filter(
      (p) => p.minStock && p.stockQuantity <= p.minStock,
    );

    // Produits par catégorie
    const productsByCategory = products.reduce(
      (acc, p) => {
        const categoryName = p.category?.name || 'Sans catégorie';
        if (!acc[categoryName]) {
          acc[categoryName] = { count: 0, value: 0 };
        }
        acc[categoryName].count++;
        acc[categoryName].value += p.stockQuantity * (p.costPrice || 0);
        return acc;
      },
      {} as Record<string, { count: number; value: number }>,
    );

    return {
      totalProducts: products.length,
      totalValue,
      lowStockProducts: lowStockProducts.length,
      productsByCategory,
      lowStockList: lowStockProducts.slice(0, 10),
    };
  }

  // Statistiques RH
  async getHRAnalytics(companyId: string) {
    const organizationId = await this.getOrganizationId(companyId);

    const employees = await this.prisma.employee.findMany({
      where: { companyId: organizationId },
      include: {
        department: true,
        position: true,
      },
    });

    const activeEmployees = employees.filter((e) => e.isActive).length;
    const inactiveEmployees = employees.filter((e) => !e.isActive).length;

    // Employés par département
    const employeesByDepartment = employees.reduce(
      (acc, e) => {
        const deptName = e.department?.name || 'Sans département';
        acc[deptName] = (acc[deptName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Masse salariale
    const totalSalary = employees
      .filter((e) => e.isActive && e.baseSalary)
      .reduce((sum, e) => sum + (e.baseSalary || 0), 0);

    return {
      totalEmployees: employees.length,
      activeEmployees,
      inactiveEmployees,
      employeesByDepartment,
      totalSalary,
    };
  }

  // Top produits vendus
  async getTopProducts(companyId: string, limit: number = 10) {
    const organizationId = await this.getOrganizationId(companyId);

    const topProducts = await this.prisma.saleItem.groupBy({
      by: ['productId'],
      where: {
        sale: {
          companyId: organizationId,
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
      take: limit,
    });

    // Récupérer les détails des produits
    const productIds = topProducts.map((p) => p.productId);
    const products = await this.prisma.inventoryProduct.findMany({
      where: { id: { in: productIds } },
    });

    return topProducts.map((tp) => {
      const product = products.find((p) => p.id === tp.productId);
      return {
        productId: tp.productId,
        productName: product?.name || 'Produit inconnu',
        quantitySold: tp._sum.quantity || 0,
        revenue: tp._sum.total || 0,
      };
    });
  }

  // Évolution du chiffre d'affaires
  async getRevenueTrend(companyId: string, period: string = 'month') {
    const organizationId = await this.getOrganizationId(companyId);

    const now = new Date();
    let startDate: Date;
    let groupBy: 'day' | 'week' | 'month';

    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        groupBy = 'day';
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        groupBy = 'month';
        break;
      case 'month':
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        groupBy = 'day';
    }

    const sales = await this.prisma.sale.findMany({
      where: {
        companyId: organizationId,
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        total: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Grouper par période
    const trend = sales.reduce(
      (acc, sale) => {
        let key: string;
        if (groupBy === 'day') {
          key = sale.createdAt.toISOString().split('T')[0];
        } else if (groupBy === 'month') {
          key = `${sale.createdAt.getFullYear()}-${String(sale.createdAt.getMonth() + 1).padStart(2, '0')}`;
        } else {
          // week
          const weekNumber = Math.ceil(sale.createdAt.getDate() / 7);
          key = `${sale.createdAt.getFullYear()}-W${weekNumber}`;
        }

        if (!acc[key]) {
          acc[key] = { date: key, revenue: 0, count: 0 };
        }
        acc[key].revenue += sale.total;
        acc[key].count++;
        return acc;
      },
      {} as Record<string, { date: string; revenue: number; count: number }>,
    );

    return Object.values(trend);
  }
}
