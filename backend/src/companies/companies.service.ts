import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async findBySlug(slug: string) {
    const company = await this.prisma.company.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        phoneNumber: true,
        modules: true,
      },
    });

    if (!company) {
      throw new NotFoundException('Entreprise introuvable');
    }

    return company;
  }
}
