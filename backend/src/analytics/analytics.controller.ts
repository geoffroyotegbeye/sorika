import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('companies/:companyId/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Dashboard général
  @Get('dashboard')
  async getDashboard(
    @Param('companyId') companyId: string,
    @Query('period') period?: string, // today, week, month, year
  ) {
    return this.analyticsService.getDashboard(companyId, period);
  }

  // Statistiques de ventes
  @Get('sales')
  async getSalesAnalytics(
    @Param('companyId') companyId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getSalesAnalytics(
      companyId,
      startDate,
      endDate,
    );
  }

  // Statistiques CRM
  @Get('crm')
  async getCRMAnalytics(@Param('companyId') companyId: string) {
    return this.analyticsService.getCRMAnalytics(companyId);
  }

  // Statistiques Inventaire
  @Get('inventory')
  async getInventoryAnalytics(@Param('companyId') companyId: string) {
    return this.analyticsService.getInventoryAnalytics(companyId);
  }

  // Statistiques RH
  @Get('hr')
  async getHRAnalytics(@Param('companyId') companyId: string) {
    return this.analyticsService.getHRAnalytics(companyId);
  }

  // Top produits
  @Get('top-products')
  async getTopProducts(
    @Param('companyId') companyId: string,
    @Query('limit') limit?: string,
  ) {
    return this.analyticsService.getTopProducts(
      companyId,
      parseInt(limit || '10'),
    );
  }

  // Évolution du chiffre d'affaires
  @Get('revenue-trend')
  async getRevenueTrend(
    @Param('companyId') companyId: string,
    @Query('period') period?: string, // week, month, year
  ) {
    return this.analyticsService.getRevenueTrend(companyId, period);
  }
}
