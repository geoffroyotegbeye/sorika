import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ModuleGuard, RequireModule } from '../common/guards/module.guard';

@Controller('companies/:companyId/crm')
@UseGuards(ModuleGuard)
export class CrmController {
  /**
   * Cette route nécessite le module CRM
   * Si l'entreprise n'a que LANDING_PAGE, elle sera bloquée
   */
  @Get('customers')
  @RequireModule('CRM')
  async getCustomers(@Param('companyId') companyId: string) {
    return {
      message: 'Liste des clients',
      companyId,
      // Logique CRM ici
    };
  }

  /**
   * Exemple avec module ANALYTICS
   */
  @Get('analytics')
  @RequireModule('ANALYTICS')
  async getAnalytics(@Param('companyId') companyId: string) {
    return {
      message: 'Statistiques',
      companyId,
    };
  }
}
