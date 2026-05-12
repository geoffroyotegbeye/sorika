import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { runSeed } from './seed.helper';

// Tous les modules disponibles dans la plateforme
export const ALL_MODULES = [
  'LANDING_PAGE',
  'MEDIA',
  'CRM',
  'HR',
  'ACCOUNTING',
  'INVENTORY',
  'POS',
  'PROJECTS',
  'ANALYTICS',
  'ECOMMERCE',
  'MESSAGING',
  'BLOG',
];

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ─── Stats globales ───────────────────────────────────────────────────────────

  async getGlobalStats() {
    const [
      totalUsers,
      totalCompanies,
      totalEmployees,
      totalContacts,
      totalInvoices,
      totalProjects,
      newUsersThisMonth,
      newCompaniesThisMonth,
      recentActivity,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.company.count(),
      this.prisma.employee.count(),
      this.prisma.contact.count(),
      this.prisma.invoice.count(),
      this.prisma.project.count(),
      this.prisma.user.count({
        where: {
          createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        },
      }),
      this.prisma.company.count({
        where: {
          createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        },
      }),
      // Dernières inscriptions
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          memberships: {
            select: { company: { select: { name: true, slug: true } } },
            take: 1,
          },
        },
      }),
    ]);

    // Répartition des modules utilisés
    const companies = await this.prisma.company.findMany({
      select: { modules: true },
    });

    const moduleUsage: Record<string, number> = {};
    for (const company of companies) {
      for (const mod of company.modules) {
        moduleUsage[mod] = (moduleUsage[mod] || 0) + 1;
      }
    }

    return {
      totalUsers,
      totalCompanies,
      totalEmployees,
      totalContacts,
      totalInvoices,
      totalProjects,
      newUsersThisMonth,
      newCompaniesThisMonth,
      moduleUsage,
      recentActivity,
    };
  }

  // ─── Utilisateurs ─────────────────────────────────────────────────────────────

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        isSuperAdmin: true,
        mustChangePassword: true,
        createdAt: true,
        memberships: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                slug: true,
                modules: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        isSuperAdmin: true,
        mustChangePassword: true,
        createdAt: true,
        memberships: {
          include: {
            company: {
              select: { id: true, name: true, slug: true, modules: true },
            },
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    return this.prisma.$transaction(async (tx) => {
      await tx.membership.deleteMany({ where: { userId } });
      return tx.user.delete({ where: { id: userId } });
    });
  }

  async toggleSuperAdmin(userId: string, isSuperAdmin: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    return this.prisma.user.update({
      where: { id: userId },
      data: { isSuperAdmin },
      select: { id: true, email: true, isSuperAdmin: true },
    });
  }

  async resetUserPassword(userId: string, newPassword: string) {
    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException('Le mot de passe doit contenir au moins 6 caractères');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const hashed = await bcrypt.hash(newPassword, 10);

    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed, mustChangePassword: true },
      select: { id: true, email: true },
    });
  }

  // ─── Entreprises ──────────────────────────────────────────────────────────────

  async getAllCompanies() {
    return this.prisma.company.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                isSuperAdmin: true,
              },
            },
          },
        },
        _count: {
          select: {
            pages: true,
            products: true,
            employees: true,
            contacts: true,
            invoices: true,
            projects: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCompanyById(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        _count: {
          select: {
            pages: true,
            products: true,
            employees: true,
            contacts: true,
            invoices: true,
            projects: true,
            medias: true,
          },
        },
      },
    });

    if (!company) throw new NotFoundException('Entreprise introuvable');
    return company;
  }

  async deleteCompany(companyId: string) {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Entreprise introuvable');

    // Cascade delete via Prisma (onDelete: Cascade sur la plupart des relations)
    return this.prisma.$transaction(async (tx) => {
      await tx.landingPage.deleteMany({ where: { companyId } });
      await tx.page.deleteMany({ where: { companyId } });
      await tx.product.deleteMany({ where: { companyId } });
      await tx.membership.deleteMany({ where: { companyId } });
      await tx.invitation.deleteMany({ where: { companyId } });
      return tx.company.delete({ where: { id: companyId } });
    });
  }

  // ─── Gestion des modules ──────────────────────────────────────────────────────

  async getCompanyModules(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true, name: true, modules: true },
    });

    if (!company) throw new NotFoundException('Entreprise introuvable');

    return {
      companyId: company.id,
      companyName: company.name,
      activeModules: company.modules,
      allModules: ALL_MODULES,
    };
  }

  async updateCompanyModules(companyId: string, modules: string[]) {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Entreprise introuvable');

    // Valider que tous les modules fournis sont valides
    const invalidModules = modules.filter((m) => !ALL_MODULES.includes(m));
    if (invalidModules.length > 0) {
      throw new BadRequestException(`Modules invalides : ${invalidModules.join(', ')}`);
    }

    return this.prisma.company.update({
      where: { id: companyId },
      data: { modules },
      select: { id: true, name: true, modules: true },
    });
  }

  async toggleCompanyModule(companyId: string, moduleName: string, enabled: boolean) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { modules: true },
    });

    if (!company) throw new NotFoundException('Entreprise introuvable');

    if (!ALL_MODULES.includes(moduleName)) {
      throw new BadRequestException(`Module invalide : ${moduleName}`);
    }

    let updatedModules: string[];
    if (enabled) {
      updatedModules = company.modules.includes(moduleName)
        ? company.modules
        : [...company.modules, moduleName];
    } else {
      updatedModules = company.modules.filter((m) => m !== moduleName);
    }

    return this.prisma.company.update({
      where: { id: companyId },
      data: { modules: updatedModules },
      select: { id: true, name: true, modules: true },
    });
  }

  // ─── Gestion des membres d'une entreprise ────────────────────────────────────

  async getCompanyMembers(companyId: string) {
    return this.prisma.membership.findMany({
      where: { companyId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            isSuperAdmin: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async updateMemberRole(companyId: string, userId: string, role: string) {
    const validRoles = ['OWNER', 'ADMIN', 'STAFF'];
    if (!validRoles.includes(role)) {
      throw new BadRequestException(`Rôle invalide : ${role}`);
    }

    const membership = await this.prisma.membership.findUnique({
      where: { userId_companyId: { userId, companyId } },
    });

    if (!membership) throw new NotFoundException('Membre introuvable');

    return this.prisma.membership.update({
      where: { userId_companyId: { userId, companyId } },
      data: { role },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
    });
  }

  async revokeMemberAccess(companyId: string, userId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: { userId_companyId: { userId, companyId } },
    });

    if (!membership) throw new NotFoundException('Membre introuvable');

    return this.prisma.membership.delete({
      where: { userId_companyId: { userId, companyId } },
    });
  }

  // ─── Seed données de test ─────────────────────────────────────────────────────

  async seedCompanyData(companyId: string) {
    return runSeed(this.prisma, companyId);
  }
}
