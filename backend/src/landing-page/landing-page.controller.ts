import { Controller, Get, Put, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ModuleGuard, RequireModule } from '../common/guards/module.guard';
import { LandingPageService } from './landing-page.service';

@Controller('companies/:companyId/landing-page')
@UseGuards(ModuleGuard)
export class LandingPageController {
  constructor(private landingPageService: LandingPageService) {}

  /**
   * Récupérer la configuration complète de l'éditeur
   */
  @Get()
  @RequireModule('LANDING_PAGE')
  async getLandingPage(@Param('companyId') companyId: string) {
    return this.landingPageService.findByCompanyId(companyId);
  }

  /**
   * Sauvegarder les éléments de l'éditeur (auto-save)
   */
  @Put('elements')
  @RequireModule('LANDING_PAGE')
  async saveElements(
    @Param('companyId') companyId: string,
    @Body() data: { elements: any[] },
  ) {
    return this.landingPageService.saveElements(companyId, data.elements);
  }

  /**
   * Sauvegarder les styles globaux
   */
  @Put('global-styles')
  @RequireModule('LANDING_PAGE')
  async saveGlobalStyles(
    @Param('companyId') companyId: string,
    @Body() data: { globalStyles: any },
  ) {
    return this.landingPageService.saveGlobalStyles(companyId, data.globalStyles);
  }

  /**
   * Publier le site (rendre visible au public)
   */
  @Post('publish')
  @RequireModule('LANDING_PAGE')
  async publish(@Param('companyId') companyId: string) {
    return this.landingPageService.publish(companyId);
  }

  /**
   * Dépublier le site
   */
  @Post('unpublish')
  @RequireModule('LANDING_PAGE')
  async unpublish(@Param('companyId') companyId: string) {
    return this.landingPageService.unpublish(companyId);
  }
}
