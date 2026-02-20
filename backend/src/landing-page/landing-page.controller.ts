import { Controller, Get, Put, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ModuleGuard, RequireModule } from '../common/guards/module.guard';
import { LandingPageService } from './landing-page.service';

@Controller('companies/:companyId/landing-page')
@UseGuards(ModuleGuard)
export class LandingPageController {
  constructor(private landingPageService: LandingPageService) {}

  /**
   * Récupérer la configuration complète du site
   */
  @Get()
  @RequireModule('LANDING_PAGE')
  async getLandingPage(@Param('companyId') companyId: string) {
    return this.landingPageService.findByCompanyId(companyId);
  }

  /**
   * Mettre à jour le site (sections, theme, etc.)
   */
  @Put()
  @RequireModule('LANDING_PAGE')
  async updateLandingPage(
    @Param('companyId') companyId: string,
    @Body() updateData: any,
  ) {
    return this.landingPageService.update(companyId, updateData);
  }

  /**
   * Sauvegarder les sections du site
   */
  @Put('sections')
  @RequireModule('LANDING_PAGE')
  async saveSections(
    @Param('companyId') companyId: string,
    @Body() data: { sections: any },
  ) {
    return this.landingPageService.saveSections(companyId, data.sections);
  }

  /**
   * Sauvegarder le thème (couleurs, typographies)
   */
  @Put('theme')
  @RequireModule('LANDING_PAGE')
  async saveTheme(
    @Param('companyId') companyId: string,
    @Body() data: { theme: any },
  ) {
    return this.landingPageService.saveTheme(companyId, data.theme);
  }

  /**
   * Changer le template de design
   */
  @Put('template')
  @RequireModule('LANDING_PAGE')
  async changeTemplate(
    @Param('companyId') companyId: string,
    @Body() data: { templateName: string; theme: any },
  ) {
    return this.landingPageService.changeTemplate(companyId, data.templateName, data.theme);
  }

  /**
   * Activer le site (rendre visible au public)
   */
  @Post('activate')
  @RequireModule('LANDING_PAGE')
  async activate(@Param('companyId') companyId: string) {
    return this.landingPageService.activate(companyId);
  }

  /**
   * Désactiver le site
   */
  @Post('deactivate')
  @RequireModule('LANDING_PAGE')
  async deactivate(@Param('companyId') companyId: string) {
    return this.landingPageService.deactivate(companyId);
  }
}
