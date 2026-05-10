import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/contacts/create-contact.dto';
import { UpdateContactDto } from './dto/contacts/update-contact.dto';
import { CreateCompanyDto } from './dto/companies/create-company.dto';
import { UpdateCompanyDto } from './dto/companies/update-company.dto';
import { CreateOpportunityDto } from './dto/opportunities/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/opportunities/update-opportunity.dto';
import { UpdateStageDto } from './dto/opportunities/update-stage.dto';
import { CreateActivityDto } from './dto/activities/create-activity.dto';
import { UpdateActivityDto } from './dto/activities/update-activity.dto';

@Injectable()
export class CrmService {
  constructor(private prisma: PrismaService) {}

  // Helper pour récupérer l'ID de l'organisation à partir du slug
  private async getOrganizationId(slugOrId: string): Promise<string> {
    const organization = await this.prisma.company.findUnique({
      where: { slug: slugOrId },
      select: { id: true },
    });

    if (!organization) {
      throw new NotFoundException('Organisation non trouvée');
    }

    return organization.id;
  }

  // ============================================
  // CONTACTS
  // ============================================

  async listContacts(organizationSlugOrId: string, filters?: any) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    const where: any = { organizationId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.ownerId) {
      where.ownerId = filters.ownerId;
    }

    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.contact.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getContact(id: string, organizationSlugOrId: string) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    const contact = await this.prisma.contact.findFirst({
      where: { id, organizationId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            industry: true,
            size: true,
          },
        },
        opportunities: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact non trouvé');
    }

    return contact;
  }

  async createContact(
    organizationSlugOrId: string,
    dto: CreateContactDto,
    ownerId: string,
  ) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    // Vérifier si l'email existe déjà
    const existing = await this.prisma.contact.findUnique({
      where: {
        email_organizationId: {
          email: dto.email,
          organizationId,
        },
      },
    });

    if (existing) {
      throw new Error('Un contact avec cet email existe déjà');
    }

    return this.prisma.contact.create({
      data: {
        ...dto,
        organizationId,
        ownerId: dto.ownerId || ownerId,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        company: true,
      },
    });
  }

  async updateContact(
    id: string,
    organizationSlugOrId: string,
    dto: UpdateContactDto,
  ) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    const contact = await this.prisma.contact.findFirst({
      where: { id, organizationId },
    });

    if (!contact) {
      throw new NotFoundException('Contact non trouvé');
    }

    return this.prisma.contact.update({
      where: { id },
      data: dto,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        company: true,
      },
    });
  }

  async deleteContact(id: string, organizationSlugOrId: string) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    const contact = await this.prisma.contact.findFirst({
      where: { id, organizationId },
    });

    if (!contact) {
      throw new NotFoundException('Contact non trouvé');
    }

    await this.prisma.contact.delete({
      where: { id },
    });

    return { message: 'Contact supprimé avec succès' };
  }

  // ============================================
  // ENTREPRISES CLIENTES
  // ============================================

  async listClientCompanies(organizationSlugOrId: string, filters?: any) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    const where: any = { organizationId };

    if (filters?.ownerId) {
      where.ownerId = filters.ownerId;
    }

    if (filters?.industry) {
      where.industry = filters.industry;
    }

    if (filters?.size) {
      where.size = filters.size;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { industry: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.clientCompany.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            contacts: true,
            opportunities: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getClientCompany(id: string, organizationSlugOrId: string) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    const company = await this.prisma.clientCompany.findFirst({
      where: { id, organizationId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        contacts: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        opportunities: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Entreprise non trouvée');
    }

    return company;
  }

  async createClientCompany(
    organizationSlugOrId: string,
    dto: CreateCompanyDto,
    ownerId: string,
  ) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    // Vérifier si le nom existe déjà
    const existing = await this.prisma.clientCompany.findUnique({
      where: {
        name_organizationId: {
          name: dto.name,
          organizationId,
        },
      },
    });

    if (existing) {
      throw new Error('Une entreprise avec ce nom existe déjà');
    }

    return this.prisma.clientCompany.create({
      data: {
        ...dto,
        organizationId,
        ownerId: dto.ownerId || ownerId,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async updateClientCompany(
    id: string,
    organizationSlugOrId: string,
    dto: UpdateCompanyDto,
  ) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    const company = await this.prisma.clientCompany.findFirst({
      where: { id, organizationId },
    });

    if (!company) {
      throw new NotFoundException('Entreprise non trouvée');
    }

    return this.prisma.clientCompany.update({
      where: { id },
      data: dto,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteClientCompany(id: string, organizationSlugOrId: string) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    const company = await this.prisma.clientCompany.findFirst({
      where: { id, organizationId },
    });

    if (!company) {
      throw new NotFoundException('Entreprise non trouvée');
    }

    await this.prisma.clientCompany.delete({
      where: { id },
    });

    return { message: 'Entreprise supprimée avec succès' };
  }

  // ============================================
  // OPPORTUNITÉS
  // ============================================

  async listOpportunities(organizationSlugOrId: string, filters?: any) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);

    const where: any = { organizationId };

    if (filters?.stage) {
      where.stage = filters.stage;
    }

    if (filters?.ownerId) {
      where.ownerId = filters.ownerId;
    }

    if (filters?.contactId) {
      where.contactId = filters.contactId;
    }

    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.opportunity.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOpportunity(id: string, organizationSlugOrId: string) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    const opportunity = await this.prisma.opportunity.findFirst({
      where: { id, organizationId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            industry: true,
            size: true,
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunité non trouvée');
    }

    return opportunity;
  }

  async createOpportunity(
    organizationSlugOrId: string,
    dto: CreateOpportunityDto,
    ownerId: string,
  ) {
    try {
      console.log('=== CREATE OPPORTUNITY DEBUG ===');
      console.log('organizationSlugOrId:', organizationSlugOrId);
      console.log('ownerId:', ownerId);
      console.log('dto:', JSON.stringify(dto, null, 2));

      // Récupérer l'ID de l'organisation à partir du slug
      const organizationId = await this.getOrganizationId(organizationSlugOrId);
      console.log('Real organizationId:', organizationId);

      // Validation : montant positif
      if (dto.amount < 0) {
        throw new Error('Le montant doit être positif');
      }

      // Validation : date de closing prévue doit être aujourd'hui ou dans le futur
      if (dto.expectedCloseDate) {
        const expectedDate = new Date(dto.expectedCloseDate);
        const today = new Date();
        
        // Comparer uniquement les dates (ignorer les heures)
        expectedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        if (expectedDate.getTime() < today.getTime()) {
          throw new Error('La date de closing prévue doit être aujourd\'hui ou dans le futur');
        }
      }

      const dataToCreate = {
        ...dto,
        organizationId,
        ownerId: dto.ownerId || ownerId,
        // Convertir la date en ISO DateTime si elle existe
        expectedCloseDate: dto.expectedCloseDate 
          ? new Date(dto.expectedCloseDate + 'T00:00:00.000Z')
          : undefined,
      };

      console.log('Data to create:', JSON.stringify(dataToCreate, null, 2));

      const result = await this.prisma.opportunity.create({
        data: dataToCreate,
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          contact: true,
          company: true,
        },
      });

      console.log('Opportunity created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('=== CREATE OPPORTUNITY ERROR ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  async updateOpportunity(
    id: string,
    organizationSlugOrId: string,
    dto: UpdateOpportunityDto,
  ) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    const opportunity = await this.prisma.opportunity.findFirst({
      where: { id, organizationId },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunité non trouvée');
    }

    // Validation : montant positif
    if (dto.amount !== undefined && dto.amount < 0) {
      throw new Error('Le montant doit être positif');
    }

    return this.prisma.opportunity.update({
      where: { id },
      data: dto,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        contact: true,
        company: true,
      },
    });
  }

  async updateStage(
    id: string,
    organizationSlugOrId: string,
    dto: UpdateStageDto,
  ) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    const opportunity = await this.prisma.opportunity.findFirst({
      where: { id, organizationId },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunité non trouvée');
    }

    // Validation : opportunité WON doit avoir une date de closing réelle
    // Note: On permet de passer à WON sans date, elle pourra être ajoutée plus tard
    if (dto.stage === 'WON' && !dto.actualCloseDate) {
      // Définir automatiquement la date d'aujourd'hui
      dto.actualCloseDate = new Date().toISOString();
    }

    // Validation : opportunité LOST - la raison est optionnelle pour le moment
    // Elle pourra être ajoutée plus tard via l'édition

    return this.prisma.opportunity.update({
      where: { id },
      data: {
        stage: dto.stage,
        actualCloseDate: dto.actualCloseDate,
        lostReason: dto.lostReason,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        contact: true,
        company: true,
      },
    });
  }

  async deleteOpportunity(id: string, organizationSlugOrId: string) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    const opportunity = await this.prisma.opportunity.findFirst({
      where: { id, organizationId },
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunité non trouvée');
    }

    await this.prisma.opportunity.delete({
      where: { id },
    });

    return { message: 'Opportunité supprimée avec succès' };
  }

  // ============================================
  // ACTIVITÉS
  // ============================================

  async listActivities(organizationSlugOrId: string, filters?: any) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    const where: any = { organizationId };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.ownerId) {
      where.ownerId = filters.ownerId;
    }

    if (filters?.contactId) {
      where.contactId = filters.contactId;
    }

    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    if (filters?.opportunityId) {
      where.opportunityId = filters.opportunityId;
    }

    if (filters?.search) {
      where.OR = [
        { subject: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.activity.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        opportunity: {
          select: {
            id: true,
            title: true,
            stage: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getActivity(id: string, organizationSlugOrId: string) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    const activity = await this.prisma.activity.findFirst({
      where: { id, organizationId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            industry: true,
          },
        },
        opportunity: {
          select: {
            id: true,
            title: true,
            amount: true,
            stage: true,
          },
        },
      },
    });

    if (!activity) {
      throw new NotFoundException('Activité non trouvée');
    }

    return activity;
  }

  async createActivity(
    organizationSlugOrId: string,
    dto: CreateActivityDto,
    ownerId: string,
  ) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    // Validation : date d'échéance doit être aujourd'hui ou dans le futur
    if (dto.dueDate) {
      const dueDate = new Date(dto.dueDate);
      const today = new Date();
      
      // Comparer uniquement les dates (ignorer les heures)
      dueDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      if (dueDate.getTime() < today.getTime()) {
        throw new Error("La date d'échéance doit être aujourd'hui ou dans le futur");
      }
    }

    // Validation : durée positive
    if (dto.duration !== undefined && dto.duration < 0) {
      throw new Error('La durée doit être positive');
    }

    // Préparer les données avec conversion de date
    const { dueDate, ...restDto } = dto;
    
    return this.prisma.activity.create({
      data: {
        ...restDto,
        organizationId,
        ownerId: dto.ownerId || ownerId,
        // Convertir la date en ISO DateTime si elle existe
        dueDate: dueDate 
          ? new Date(dueDate + 'T00:00:00.000Z')
          : undefined,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        contact: true,
        company: true,
        opportunity: true,
      },
    });
  }

  async updateActivity(
    id: string,
    organizationSlugOrId: string,
    dto: UpdateActivityDto,
  ) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    const activity = await this.prisma.activity.findFirst({
      where: { id, organizationId },
    });

    if (!activity) {
      throw new NotFoundException('Activité non trouvée');
    }

    // Validation : durée positive
    if (dto.duration !== undefined && dto.duration < 0) {
      throw new Error('La durée doit être positive');
    }

    return this.prisma.activity.update({
      where: { id },
      data: dto,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        contact: true,
        company: true,
        opportunity: true,
      },
    });
  }

  async completeActivity(id: string, organizationSlugOrId: string) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    const activity = await this.prisma.activity.findFirst({
      where: { id, organizationId },
    });

    if (!activity) {
      throw new NotFoundException('Activité non trouvée');
    }

    return this.prisma.activity.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        contact: true,
        company: true,
        opportunity: true,
      },
    });
  }

  async deleteActivity(id: string, organizationSlugOrId: string) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    const activity = await this.prisma.activity.findFirst({
      where: { id, organizationId },
    });

    if (!activity) {
      throw new NotFoundException('Activité non trouvée');
    }

    await this.prisma.activity.delete({
      where: { id },
    });

    return { message: 'Activité supprimée avec succès' };
  }

  // ============================================
  // DASHBOARD & STATS
  // ============================================

  async getCRMStats(organizationSlugOrId: string) {
    const organizationId = await this.getOrganizationId(organizationSlugOrId);
    // Statistiques des contacts par statut
    const contactsByStatus = await this.prisma.contact.groupBy({
      by: ['status'],
      where: { organizationId },
      _count: true,
    });

    const totalContacts = await this.prisma.contact.count({
      where: { organizationId },
    });

    // Nombre d'entreprises clientes
    const totalCompanies = await this.prisma.clientCompany.count({
      where: { organizationId },
    });

    // Pipeline de ventes
    const opportunitiesByStage = await this.prisma.opportunity.groupBy({
      by: ['stage'],
      where: { organizationId },
      _count: true,
      _sum: {
        amount: true,
      },
    });

    const totalPipelineValue = await this.prisma.opportunity.aggregate({
      where: {
        organizationId,
        stage: {
          notIn: ['WON', 'LOST'],
        },
      },
      _sum: {
        amount: true,
      },
    });

    const wonOpportunities = await this.prisma.opportunity.aggregate({
      where: {
        organizationId,
        stage: 'WON',
      },
      _count: true,
      _sum: {
        amount: true,
      },
    });

    const totalOpportunities = await this.prisma.opportunity.count({
      where: { organizationId },
    });

    // Taux de conversion (WON / Total)
    const conversionRate =
      totalOpportunities > 0
        ? ((wonOpportunities._count || 0) / totalOpportunities) * 100
        : 0;

    // Activités à venir (aujourd'hui et cette semaine)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const activitiesToday = await this.prisma.activity.count({
      where: {
        organizationId,
        status: 'PLANNED',
        dueDate: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const activitiesThisWeek = await this.prisma.activity.count({
      where: {
        organizationId,
        status: 'PLANNED',
        dueDate: {
          gte: today,
          lt: nextWeek,
        },
      },
    });

    // Activités en retard
    const overdueActivities = await this.prisma.activity.count({
      where: {
        organizationId,
        status: 'PLANNED',
        dueDate: {
          lt: today,
        },
      },
    });

    // Top commerciaux (par CA généré)
    const topSalespeople = await this.prisma.opportunity.groupBy({
      by: ['ownerId'],
      where: {
        organizationId,
        stage: 'WON',
      },
      _sum: {
        amount: true,
      },
      _count: true,
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
      take: 5,
    });

    // Récupérer les infos des commerciaux
    const topSalespeopleWithDetails = await Promise.all(
      topSalespeople.map(async (sp) => {
        const user = await this.prisma.user.findUnique({
          where: { id: sp.ownerId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        });
        return {
          user,
          revenue: sp._sum.amount || 0,
          dealsWon: sp._count,
        };
      }),
    );

    return {
      contacts: {
        total: totalContacts,
        byStatus: contactsByStatus.reduce((acc, item) => {
          acc[item.status] = item._count;
          return acc;
        }, {} as Record<string, number>),
      },
      companies: {
        total: totalCompanies,
      },
      pipeline: {
        totalValue: totalPipelineValue._sum.amount || 0,
        byStage: opportunitiesByStage.map((item) => ({
          stage: item.stage,
          count: item._count,
          value: item._sum.amount || 0,
        })),
        conversionRate: Math.round(conversionRate * 100) / 100,
        wonDeals: {
          count: wonOpportunities._count || 0,
          value: wonOpportunities._sum.amount || 0,
        },
      },
      activities: {
        today: activitiesToday,
        thisWeek: activitiesThisWeek,
        overdue: overdueActivities,
      },
      topSalespeople: topSalespeopleWithDetails,
    };
  }
}
