import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, createPageDto: CreatePageDto) {
    // Générer le slug si non fourni
    const slug = createPageDto.slug || this.generateSlug(createPageDto.title);

    // Vérifier si le slug existe déjà pour cette company
    const existing = await this.prisma.page.findUnique({
      where: {
        companyId_slug: {
          companyId,
          slug,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Une page avec ce slug existe déjà');
    }

    // Si c'est la page d'accueil, retirer le flag des autres pages
    if (createPageDto.isHomePage) {
      await this.prisma.page.updateMany({
        where: { companyId, isHomePage: true },
        data: { isHomePage: false },
      });
    }

    return this.prisma.page.create({
      data: {
        ...createPageDto,
        slug,
        companyId,
        elements: createPageDto.elements || [],
      },
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async findAll(companyId: string) {
    return this.prisma.page.findMany({
      where: { companyId },
      orderBy: [
        { isHomePage: 'desc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async findOne(companyId: string, slug: string) {
    const page = await this.prisma.page.findUnique({
      where: {
        companyId_slug: {
          companyId,
          slug,
        },
      },
    });

    if (!page) {
      throw new NotFoundException('Page non trouvée');
    }

    return page;
  }

  async findHomePage(companyId: string) {
    return this.prisma.page.findFirst({
      where: { companyId, isHomePage: true },
    });
  }

  async update(companyId: string, slug: string, updatePageDto: UpdatePageDto) {
    const page = await this.findOne(companyId, slug);

    // Si on change le slug, vérifier qu'il n'existe pas déjà
    if (updatePageDto.slug && updatePageDto.slug !== slug) {
      const existing = await this.prisma.page.findUnique({
        where: {
          companyId_slug: {
            companyId,
            slug: updatePageDto.slug,
          },
        },
      });

      if (existing) {
        throw new ConflictException('Une page avec ce slug existe déjà');
      }
    }

    // Si on définit comme page d'accueil, retirer le flag des autres
    if (updatePageDto.isHomePage === true) {
      await this.prisma.page.updateMany({
        where: { companyId, isHomePage: true, id: { not: page.id } },
        data: { isHomePage: false },
      });
    }

    return this.prisma.page.update({
      where: { id: page.id },
      data: updatePageDto,
    });
  }

  async updateElements(companyId: string, slug: string, elements: any[]) {
    const page = await this.findOne(companyId, slug);

    // Extraire les éléments globaux et les sauvegarder au niveau Company
    const globalElements = this.extractGlobalElements(elements);
    if (globalElements.length > 0) {
      await this.prisma.company.update({
        where: { id: companyId },
        data: { globalElements },
      });
    }

    // Retirer les éléments globaux des éléments de la page
    const pageElements = elements.filter(el => !el.isGlobal);

    return this.prisma.page.update({
      where: { id: page.id },
      data: { elements: pageElements },
    });
  }

  private extractGlobalElements(elements: any[]): any[] {
    const globals: any[] = [];
    
    const traverse = (els: any[]) => {
      for (const el of els) {
        if (el.isGlobal) {
          globals.push(el);
        }
        if (el.children?.length > 0) {
          traverse(el.children);
        }
      }
    };
    
    traverse(elements);
    return globals;
  }

  async getGlobalElements(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { globalElements: true },
    });
    return (company?.globalElements as any[]) || [];
  }

  async publish(companyId: string, slug: string) {
    const page = await this.findOne(companyId, slug);

    return this.prisma.page.update({
      where: { id: page.id },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }

  async unpublish(companyId: string, slug: string) {
    const page = await this.findOne(companyId, slug);

    return this.prisma.page.update({
      where: { id: page.id },
      data: { isPublished: false },
    });
  }

  async remove(companyId: string, slug: string) {
    const page = await this.findOne(companyId, slug);

    if (page.isHomePage) {
      throw new ConflictException('Impossible de supprimer la page d\'accueil');
    }

    return this.prisma.page.delete({
      where: { id: page.id },
    });
  }

  /**
   * Publier toutes les pages du site en même temps
   */
  async publishAll(companyId: string) {
    const now = new Date();
    
    return this.prisma.page.updateMany({
      where: { companyId },
      data: {
        isPublished: true,
        publishedAt: now,
      },
    });
  }

  /**
   * Dépublier toutes les pages
   */
  async unpublishAll(companyId: string) {
    return this.prisma.page.updateMany({
      where: { companyId },
      data: { isPublished: false },
    });
  }
}
