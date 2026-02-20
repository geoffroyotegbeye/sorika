import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LandingPageService {
  constructor(private prisma: PrismaService) {}

  async findByCompanyId(companyId: string) {
    const landingPage = await this.prisma.landingPage.findUnique({
      where: { companyId },
    });

    if (!landingPage) {
      throw new NotFoundException('Landing page non trouvée');
    }

    return landingPage;
  }

  async update(companyId: string, updateData: any) {
    return this.prisma.landingPage.update({
      where: { companyId },
      data: updateData,
    });
  }

  /**
   * Sauvegarder les sections du site
   */
  async saveSections(companyId: string, sections: any) {
    return this.prisma.landingPage.update({
      where: { companyId },
      data: { 
        sections,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Sauvegarder le thème (couleurs, typographies, etc.)
   */
  async saveTheme(companyId: string, theme: any) {
    return this.prisma.landingPage.update({
      where: { companyId },
      data: { 
        theme,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Changer le template
   */
  async changeTemplate(companyId: string, templateName: string, theme: any) {
    return this.prisma.landingPage.update({
      where: { companyId },
      data: { 
        templateName,
        theme,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Activer le site
   */
  async activate(companyId: string) {
    return this.prisma.landingPage.update({
      where: { companyId },
      data: { 
        isActive: true,
        publishedAt: new Date(),
      },
    });
  }

  /**
   * Désactiver le site
   */
  async deactivate(companyId: string) {
    return this.prisma.landingPage.update({
      where: { companyId },
      data: { 
        isActive: false,
      },
    });
  }
}
