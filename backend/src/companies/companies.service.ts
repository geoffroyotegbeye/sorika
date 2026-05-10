import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCompanySettingsDto } from './dto/update-company-settings.dto';
import { CreatePublicHolidayDto } from './dto/create-public-holiday.dto';

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
        address: true,
        currency: true,
        logo: true,
        modules: true,
      },
    });

    if (!company) {
      throw new NotFoundException('Entreprise introuvable');
    }

    return company;
  }

  async getSettings(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        slug: true,
        phoneNumber: true,
        address: true,
        currency: true,
        logo: true,
        modules: true,
        createdAt: true,
      },
    });

    if (!company) {
      throw new NotFoundException('Entreprise introuvable');
    }

    return company;
  }

  async updateSettings(companyId: string, dto: UpdateCompanySettingsDto, userId: string) {
    // Vérifier que l'utilisateur est OWNER
    const membership = await this.prisma.membership.findUnique({
      where: { userId_companyId: { userId, companyId } },
    });

    if (!membership || membership.role !== 'OWNER') {
      throw new ForbiddenException('Seul le propriétaire peut modifier les paramètres');
    }

    return this.prisma.company.update({
      where: { id: companyId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.phoneNumber !== undefined && { phoneNumber: dto.phoneNumber }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.currency && { currency: dto.currency }),
        ...(dto.logo !== undefined && { logo: dto.logo }),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        phoneNumber: true,
        address: true,
        currency: true,
        logo: true,
        modules: true,
      },
    });
  }

  // ── Gestion des jours fériés ──

  async listPublicHolidays(companyId: string, year?: number) {
    const where: any = { companyId };
    
    if (year) {
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31, 23, 59, 59);
      where.date = {
        gte: startOfYear,
        lte: endOfYear,
      };
    }

    return this.prisma.publicHoliday.findMany({
      where,
      orderBy: { date: 'asc' },
    });
  }

  async createPublicHoliday(companyId: string, dto: CreatePublicHolidayDto, userId: string) {
    // Vérifier que l'utilisateur est OWNER ou ADMIN
    const membership = await this.prisma.membership.findUnique({
      where: { userId_companyId: { userId, companyId } },
    });

    if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
      throw new ForbiddenException('Permission refusée');
    }

    return this.prisma.publicHoliday.create({
      data: {
        name: dto.name,
        date: new Date(dto.date),
        isRecurring: dto.isRecurring ?? true,
        companyId,
      },
    });
  }

  async deletePublicHoliday(companyId: string, holidayId: string, userId: string) {
    // Vérifier que l'utilisateur est OWNER ou ADMIN
    const membership = await this.prisma.membership.findUnique({
      where: { userId_companyId: { userId, companyId } },
    });

    if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
      throw new ForbiddenException('Permission refusée');
    }

    // Vérifier que le jour férié appartient à cette entreprise
    const holiday = await this.prisma.publicHoliday.findUnique({
      where: { id: holidayId },
    });

    if (!holiday || holiday.companyId !== companyId) {
      throw new NotFoundException('Jour férié introuvable');
    }

    return this.prisma.publicHoliday.delete({
      where: { id: holidayId },
    });
  }

  async initializeDefaultHolidays(companyId: string, userId: string) {
    // Vérifier que l'utilisateur est OWNER ou ADMIN
    const membership = await this.prisma.membership.findUnique({
      where: { userId_companyId: { userId, companyId } },
    });

    if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
      throw new ForbiddenException('Permission refusée');
    }

    const currentYear = new Date().getFullYear();

    // Jours fériés du Bénin (récurrents chaque année)
    const defaultHolidays = [
      { name: 'Jour de l\'An', date: `${currentYear}-01-01` },
      { name: 'Fête du Travail', date: `${currentYear}-05-01` },
      { name: 'Fête de l\'Indépendance', date: `${currentYear}-08-01` },
      { name: 'Fête Nationale', date: `${currentYear}-11-30` },
      { name: 'Noël', date: `${currentYear}-12-25` },
      // Fêtes religieuses (dates variables - à ajuster manuellement)
      { name: 'Lundi de Pâques', date: `${currentYear}-04-21` },
      { name: 'Ascension', date: `${currentYear}-05-29` },
      { name: 'Lundi de Pentecôte', date: `${currentYear}-06-09` },
      { name: 'Assomption', date: `${currentYear}-08-15` },
      { name: 'Toussaint', date: `${currentYear}-11-01` },
    ];

    const created: any[] = [];
    for (const holiday of defaultHolidays) {
      const existing = await this.prisma.publicHoliday.findFirst({
        where: {
          companyId,
          name: holiday.name,
          date: new Date(holiday.date),
        },
      });

      if (!existing) {
        const newHoliday = await this.prisma.publicHoliday.create({
          data: {
            name: holiday.name,
            date: new Date(holiday.date),
            isRecurring: true,
            companyId,
          },
        });
        created.push(newHoliday);
      }
    }

    return { created: created.length, holidays: created };
  }
}
