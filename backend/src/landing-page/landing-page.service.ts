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
   * Sauvegarder les éléments de l'éditeur (auto-save)
   */
  async saveElements(companyId: string, elements: any[]) {
    return this.prisma.landingPage.update({
      where: { companyId },
      data: { 
        elements,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Sauvegarder les styles globaux
   */
  async saveGlobalStyles(companyId: string, globalStyles: any) {
    return this.prisma.landingPage.update({
      where: { companyId },
      data: { 
        globalStyles,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Publier le site
   */
  async publish(companyId: string) {
    return this.prisma.landingPage.update({
      where: { companyId },
      data: { 
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }

  /**
   * Dépublier le site
   */
  async unpublish(companyId: string) {
    return this.prisma.landingPage.update({
      where: { companyId },
      data: { 
        isPublished: false,
      },
    });
  }
}
