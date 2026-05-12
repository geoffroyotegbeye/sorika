import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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
    return this._runSeed(companyId);
  }

  private async _runSeed(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: { members: { include: { user: true }, take: 1 } },
    });
    if (!company) throw new NotFoundException('Entreprise introuvable');

    const ownerId = company.members[0]?.userId;
    if (!ownerId) throw new BadRequestException('Aucun membre trouvé pour cette organisation');

    const today = new Date();
    const d = (offset: number) => {
      const dt = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
      return dt;
    };
    const dt = (offset: number, h = 8, m = 0) => {
      const dt2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
      dt2.setHours(h, m, 0, 0);
      return dt2;
    };
    const ts = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    return this.prisma.$transaction(async (tx) => {
      // ── 1. RH : Positions ──────────────────────────────────────────────────
      const [posDG, posCFO, posRH, posDev, posDevJr, posComm, posCompta, posStage] = await Promise.all([
        tx.position.upsert({ where: { companyId_title: { companyId, title: 'Directeur Général' } },    update: {}, create: { companyId, title: 'Directeur Général',    level: 'EXECUTIVE', description: 'Direction et stratégie' } }),
        tx.position.upsert({ where: { companyId_title: { companyId, title: 'Directeur Financier' } },  update: {}, create: { companyId, title: 'Directeur Financier',  level: 'EXECUTIVE', description: 'Gestion financière' } }),
        tx.position.upsert({ where: { companyId_title: { companyId, title: 'Responsable RH' } },       update: {}, create: { companyId, title: 'Responsable RH',       level: 'MANAGER',   description: 'Gestion des ressources humaines' } }),
        tx.position.upsert({ where: { companyId_title: { companyId, title: 'Développeur Senior' } },   update: {}, create: { companyId, title: 'Développeur Senior',   level: 'STAFF',     description: 'Développement logiciel senior' } }),
        tx.position.upsert({ where: { companyId_title: { companyId, title: 'Développeur Junior' } },   update: {}, create: { companyId, title: 'Développeur Junior',   level: 'STAFF',     description: 'Développement logiciel junior' } }),
        tx.position.upsert({ where: { companyId_title: { companyId, title: 'Commercial' } },           update: {}, create: { companyId, title: 'Commercial',           level: 'STAFF',     description: 'Ventes et prospection' } }),
        tx.position.upsert({ where: { companyId_title: { companyId, title: 'Comptable' } },            update: {}, create: { companyId, title: 'Comptable',            level: 'STAFF',     description: 'Gestion comptable' } }),
        tx.position.upsert({ where: { companyId_title: { companyId, title: 'Stagiaire' } },            update: {}, create: { companyId, title: 'Stagiaire',            level: 'INTERN',    description: 'Stage de formation' } }),
      ]);

      // ── 2. RH : Départements ───────────────────────────────────────────────
      const [deptDir, deptRH, deptTech, deptComm, deptFinance] = await Promise.all([
        tx.department.upsert({ where: { companyId_name: { companyId, name: 'Direction' } },           update: {}, create: { companyId, name: 'Direction',           description: 'Direction générale' } }),
        tx.department.upsert({ where: { companyId_name: { companyId, name: 'Ressources Humaines' } }, update: {}, create: { companyId, name: 'Ressources Humaines', description: 'Gestion du personnel' } }),
        tx.department.upsert({ where: { companyId_name: { companyId, name: 'Technique' } },           update: {}, create: { companyId, name: 'Technique',           description: 'Développement et IT' } }),
        tx.department.upsert({ where: { companyId_name: { companyId, name: 'Commercial' } },          update: {}, create: { companyId, name: 'Commercial',          description: 'Ventes et marketing' } }),
        tx.department.upsert({ where: { companyId_name: { companyId, name: 'Finance' } },             update: {}, create: { companyId, name: 'Finance',             description: 'Comptabilité et finance' } }),
      ]);

      // ── 3. RH : Employés (8 employés avec hiérarchie) ─────────────────────
      const emp1 = await tx.employee.create({ data: { companyId, firstName: 'Kofi',    lastName: 'Mensah',    positionId: posDG.id,     departmentId: deptDir.id,     contractType: 'CDI',   salary: 850000, hireDate: d(-730), isActive: true } });
      const emp2 = await tx.employee.create({ data: { companyId, firstName: 'Ama',     lastName: 'Diallo',    positionId: posRH.id,     departmentId: deptRH.id,      contractType: 'CDI',   salary: 450000, hireDate: d(-365), isActive: true, managerId: emp1.id } });
      const emp3 = await tx.employee.create({ data: { companyId, firstName: 'Kwame',   lastName: 'Asante',    positionId: posDev.id,    departmentId: deptTech.id,    contractType: 'CDI',   salary: 550000, hireDate: d(-180), isActive: true, managerId: emp1.id } });
      const emp4 = await tx.employee.create({ data: { companyId, firstName: 'Fatou',   lastName: 'Traoré',    positionId: posComm.id,   departmentId: deptComm.id,    contractType: 'CDD',   salary: 320000, hireDate: d(-90),  isActive: true, managerId: emp1.id } });
      const emp5 = await tx.employee.create({ data: { companyId, firstName: 'Yao',     lastName: 'Kouassi',   positionId: posDevJr.id,  departmentId: deptTech.id,    contractType: 'CDI',   salary: 280000, hireDate: d(-60),  isActive: true, managerId: emp3.id } });
      const emp6 = await tx.employee.create({ data: { companyId, firstName: 'Adjoa',   lastName: 'Mensah',    positionId: posCompta.id, departmentId: deptFinance.id, contractType: 'CDI',   salary: 380000, hireDate: d(-200), isActive: true, managerId: emp1.id } });
      const emp7 = await tx.employee.create({ data: { companyId, firstName: 'Sekou',   lastName: 'Camara',    positionId: posComm.id,   departmentId: deptComm.id,    contractType: 'CDI',   salary: 310000, hireDate: d(-120), isActive: true, managerId: emp4.id } });
      const emp8 = await tx.employee.create({ data: { companyId, firstName: 'Abena',   lastName: 'Owusu',     positionId: posStage.id,  departmentId: deptTech.id,    contractType: 'STAGE', salary: 80000,  hireDate: d(-30),  isActive: true, managerId: emp3.id } });

      // ── 4. RH : Types de congés ────────────────────────────────────────────
      const [ltCP, ltRTT, ltSick, ltUnpaid] = await Promise.all([
        tx.leaveType.upsert({ where: { companyId_code: { companyId, code: 'CP' } },     update: {}, create: { companyId, name: 'Congé payé',       code: 'CP',     isPaid: true,  requiresApproval: true,  color: '#3b82f6' } }),
        tx.leaveType.upsert({ where: { companyId_code: { companyId, code: 'RTT' } },    update: {}, create: { companyId, name: 'RTT',              code: 'RTT',    isPaid: true,  requiresApproval: true,  color: '#8b5cf6' } }),
        tx.leaveType.upsert({ where: { companyId_code: { companyId, code: 'SICK' } },   update: {}, create: { companyId, name: 'Congé maladie',    code: 'SICK',   isPaid: false, requiresApproval: false, color: '#ef4444' } }),
        tx.leaveType.upsert({ where: { companyId_code: { companyId, code: 'UNPAID' } }, update: {}, create: { companyId, name: 'Sans solde',       code: 'UNPAID', isPaid: false, requiresApproval: true,  color: '#f59e0b' } }),
      ]);

      // ── 5. RH : Soldes de congés ───────────────────────────────────────────
      const year = today.getFullYear();
      for (const [emp, cpUsed, rttUsed] of [[emp1,8,3],[emp2,5,2],[emp3,3,1],[emp4,2,0],[emp5,0,0],[emp6,4,2],[emp7,1,0],[emp8,0,0]] as [any,number,number][]) {
        await tx.leaveBalance.upsert({ where: { employeeId_leaveTypeId_year: { employeeId: emp.id, leaveTypeId: ltCP.id,  year } }, update: {}, create: { employeeId: emp.id, leaveTypeId: ltCP.id,  year, total: 25, used: cpUsed,  remaining: 25 - cpUsed  } });
        await tx.leaveBalance.upsert({ where: { employeeId_leaveTypeId_year: { employeeId: emp.id, leaveTypeId: ltRTT.id, year } }, update: {}, create: { employeeId: emp.id, leaveTypeId: ltRTT.id, year, total: 10, used: rttUsed, remaining: 10 - rttUsed } });
      }

      // ── 6. RH : Congés (historique + en cours + à venir) ──────────────────
      await tx.leave.create({ data: { companyId, employeeId: emp2.id, leaveTypeId: ltCP.id,     startDate: d(10),  endDate: d(17),  days: 5, reason: 'Vacances annuelles',    status: 'APPROVED', approvedBy: ownerId, approvedAt: d(-2) } });
      await tx.leave.create({ data: { companyId, employeeId: emp3.id, leaveTypeId: ltRTT.id,    startDate: d(5),   endDate: d(6),   days: 2, reason: 'RTT récupération',      status: 'PENDING'  } });
      await tx.leave.create({ data: { companyId, employeeId: emp4.id, leaveTypeId: ltSick.id,   startDate: d(-5),  endDate: d(-3),  days: 3, reason: 'Maladie',               status: 'APPROVED', approvedBy: ownerId, approvedAt: d(-6) } });
      await tx.leave.create({ data: { companyId, employeeId: emp6.id, leaveTypeId: ltCP.id,     startDate: d(-30), endDate: d(-24), days: 5, reason: 'Congé annuel',          status: 'APPROVED', approvedBy: ownerId, approvedAt: d(-35) } });
      await tx.leave.create({ data: { companyId, employeeId: emp7.id, leaveTypeId: ltUnpaid.id, startDate: d(20),  endDate: d(22),  days: 3, reason: 'Raison personnelle',    status: 'PENDING'  } });
      await tx.leave.create({ data: { companyId, employeeId: emp1.id, leaveTypeId: ltCP.id,     startDate: d(-60), endDate: d(-53), days: 6, reason: 'Vacances été',          status: 'APPROVED', approvedBy: ownerId, approvedAt: d(-65) } });

      // ── 7. RH : Présences (30 derniers jours ouvrés) ──────────────────────
      for (let i = 30; i >= 1; i--) {
        const date = d(-i);
        const dow = date.getDay();
        if (dow === 0 || dow === 6) continue; // skip weekends
        for (const [emp, status, hIn, hOut] of [
          [emp1, 'PRESENT', 8, 17], [emp2, 'PRESENT', 8, 17], [emp3, 'PRESENT', 9, 18],
          [emp4, i > 5 ? 'PRESENT' : 'ABSENT', 8, 17], [emp5, 'PRESENT', 9, 18],
          [emp6, 'PRESENT', 8, 17], [emp7, i === 15 ? 'LATE' : 'PRESENT', 9, 18],
        ] as [any, string, number, number][]) {
          const checkIn  = new Date(date); checkIn.setHours(hIn + (status === 'LATE' ? 1 : 0), 0, 0, 0);
          const checkOut = new Date(date); checkOut.setHours(hOut, 0, 0, 0);
          await tx.attendance.upsert({
            where: { employeeId_date: { employeeId: emp.id, date } },
            update: {},
            create: { companyId, employeeId: emp.id, date, checkIn: status !== 'ABSENT' ? checkIn : null, checkOut: status !== 'ABSENT' ? checkOut : null, status, hoursWorked: status !== 'ABSENT' ? (hOut - hIn) : 0 },
          });
        }
      }

      // ── 8. RH : Notes de frais ────────────────────────────────────────────
      await tx.expense.create({ data: { companyId, employeeId: emp4.id, title: 'Déplacement client Cotonou',  description: 'Taxi + repas client TechCorp',  amount: 45000,  currency: 'XOF', category: 'TRANSPORT',     date: d(-15), status: 'APPROVED',   approvedBy: ownerId, approvedAt: d(-14) } });
      await tx.expense.create({ data: { companyId, employeeId: emp3.id, title: 'Achat matériel dev',          description: 'Câbles et adaptateurs USB',      amount: 28000,  currency: 'XOF', category: 'OTHER',         date: d(-10), status: 'APPROVED',   approvedBy: ownerId, approvedAt: d(-9)  } });
      await tx.expense.create({ data: { companyId, employeeId: emp7.id, title: 'Repas prospect Lomé',         description: 'Déjeuner avec prospect Agro',    amount: 35000,  currency: 'XOF', category: 'MEAL',          date: d(-5),  status: 'PENDING'  } });
      await tx.expense.create({ data: { companyId, employeeId: emp6.id, title: 'Formation comptabilité',      description: 'Séminaire OHADA 2 jours',        amount: 150000, currency: 'XOF', category: 'OTHER',         date: d(-20), status: 'APPROVED',   approvedBy: ownerId, approvedAt: d(-18) } });
      await tx.expense.create({ data: { companyId, employeeId: emp2.id, title: 'Hébergement déplacement RH',  description: 'Hôtel conférence RH Abidjan',    amount: 85000,  currency: 'XOF', category: 'ACCOMMODATION', date: d(-45), status: 'REIMBURSED', approvedBy: ownerId, reimbursedAt: d(-40) } });

      // ── 9. RH : Jours fériés ──────────────────────────────────────────────
      const holidays = [
        { name: "Jour de l'An",           date: new Date(year, 0, 1)  },
        { name: "Fête du Travail",         date: new Date(year, 4, 1)  },
        { name: "Fête de l'Indépendance",  date: new Date(year, 7, 1)  },
        { name: "Fête Nationale",          date: new Date(year, 10, 30) },
        { name: "Noël",                    date: new Date(year, 11, 25) },
        { name: "Lundi de Pâques",         date: new Date(year, 3, 21) },
        { name: "Assomption",              date: new Date(year, 7, 15) },
        { name: "Toussaint",               date: new Date(year, 10, 1) },
      ];
      for (const h of holidays) {
        const existing = await tx.publicHoliday.findFirst({ where: { companyId, name: h.name } });
        if (!existing) await tx.publicHoliday.create({ data: { companyId, name: h.name, date: h.date, isRecurring: true } });
      }

      // ── 8. CRM : Entreprises clientes ─────────────────────────────────────
      const [cc1, cc2] = await Promise.all([
        tx.clientCompany.upsert({ where: { name_organizationId: { name: 'TechCorp Afrique', organizationId: companyId } }, update: {}, create: { organizationId: companyId, ownerId, name: 'TechCorp Afrique', industry: 'Technologie', size: 'MEDIUM', website: 'https://techcorp.bj', phone: '+22961000001' } }),
        tx.clientCompany.upsert({ where: { name_organizationId: { name: 'Agro Solutions SA', organizationId: companyId } }, update: {}, create: { organizationId: companyId, ownerId, name: 'Agro Solutions SA', industry: 'Agriculture',  size: 'LARGE',  website: 'https://agro.bj',    phone: '+22961000002' } }),
      ]);

      // ── 9. CRM : Contacts ─────────────────────────────────────────────────
      const [ct1, ct2, ct3] = await Promise.all([
        tx.contact.upsert({ where: { email_organizationId: { email: 'jean.dupont@techcorp.bj', organizationId: companyId } }, update: {}, create: { organizationId: companyId, ownerId, firstName: 'Jean',   lastName: 'Dupont',  email: 'jean.dupont@techcorp.bj',   phone: '+22961111111', status: 'CLIENT',   companyId: cc1.id, source: 'REFERRAL' } }),
        tx.contact.upsert({ where: { email_organizationId: { email: 'marie.kone@agro.bj',      organizationId: companyId } }, update: {}, create: { organizationId: companyId, ownerId, firstName: 'Marie',  lastName: 'Koné',    email: 'marie.kone@agro.bj',        phone: '+22962222222', status: 'PROSPECT', companyId: cc2.id, source: 'WEBSITE'  } }),
        tx.contact.upsert({ where: { email_organizationId: { email: 'paul.addo@gmail.com',      organizationId: companyId } }, update: {}, create: { organizationId: companyId, ownerId, firstName: 'Paul',   lastName: 'Addo',    email: 'paul.addo@gmail.com',        phone: '+22963333333', status: 'LEAD',     source: 'SOCIAL_MEDIA' } }),
      ]);

      // ── 10. CRM : Opportunités ────────────────────────────────────────────
      const [opp1, opp2] = await Promise.all([
        tx.opportunity.create({ data: { organizationId: companyId, ownerId, title: 'Refonte site web TechCorp',    amount: 2500000, currency: 'XOF', stage: 'PROPOSAL',     probability: 60, contactId: ct1.id, companyId: cc1.id, expectedCloseDate: d(30) } }),
        tx.opportunity.create({ data: { organizationId: companyId, ownerId, title: 'Système de gestion Agro',     amount: 5000000, currency: 'XOF', stage: 'NEGOTIATION',  probability: 75, contactId: ct2.id, companyId: cc2.id, expectedCloseDate: d(15) } }),
      ]);

      // ── 11. CRM : Activités ───────────────────────────────────────────────
      await tx.activity.create({ data: { organizationId: companyId, ownerId, type: 'CALL',    subject: 'Appel de qualification',    contactId: ct1.id, opportunityId: opp1.id, status: 'COMPLETED', completedAt: d(-3), duration: 30 } });
      await tx.activity.create({ data: { organizationId: companyId, ownerId, type: 'MEETING', subject: 'Présentation de la solution', contactId: ct2.id, opportunityId: opp2.id, status: 'PLANNED',   dueDate: d(3) } });
      await tx.activity.create({ data: { organizationId: companyId, ownerId, type: 'EMAIL',   subject: 'Envoi de la proposition',    contactId: ct3.id, status: 'COMPLETED', completedAt: d(-1) } });

      // ── 18. Inventaire : Catégories ───────────────────────────────────────
      const [catElec, catBureau, catInfo] = await Promise.all([
        tx.productCategory.upsert({ where: { name_companyId: { name: 'Électronique',       companyId } }, update: {}, create: { companyId, name: 'Électronique',       description: 'Matériel électronique' } }),
        tx.productCategory.upsert({ where: { name_companyId: { name: 'Fournitures bureau', companyId } }, update: {}, create: { companyId, name: 'Fournitures bureau', description: 'Articles de bureau'    } }),
        tx.productCategory.upsert({ where: { name_companyId: { name: 'Informatique',       companyId } }, update: {}, create: { companyId, name: 'Informatique',       description: 'Matériel informatique' } }),
      ]);

      // ── 19. Inventaire : Produits ─────────────────────────────────────────
      const [prod1, prod2, prod3] = await Promise.all([
        tx.inventoryProduct.upsert({ where: { sku_companyId: { sku: 'DELL-XPS-001',  companyId } }, update: {}, create: { companyId, categoryId: catInfo.id,   name: 'Laptop Dell XPS 15', sku: 'DELL-XPS-001',  salePrice: 850000, costPrice: 650000, stockQuantity: 5,  minStock: 2,  unit: 'pièce',   isActive: true } }),
        tx.inventoryProduct.upsert({ where: { sku_companyId: { sku: 'SCREEN-4K-001', companyId } }, update: {}, create: { companyId, categoryId: catElec.id,   name: 'Écran 27" 4K',       sku: 'SCREEN-4K-001', salePrice: 320000, costPrice: 240000, stockQuantity: 8,  minStock: 3,  unit: 'pièce',   isActive: true } }),
        tx.inventoryProduct.upsert({ where: { sku_companyId: { sku: 'PAPER-A4-001',  companyId } }, update: {}, create: { companyId, categoryId: catBureau.id, name: 'Ramette papier A4',  sku: 'PAPER-A4-001',  salePrice: 5000,   costPrice: 3500,   stockQuantity: 50, minStock: 10, unit: 'ramette', isActive: true } }),
      ]);

      // ── 20. Inventaire : Mouvements de stock ──────────────────────────────
      await tx.stockMovement.create({ data: { companyId, productId: prod1.id, type: 'IN',  quantity: 5,  reason: 'Achat initial',       stockBefore: 0,  stockAfter: 5,  unitCost: 650000, totalCost: 3250000 } });
      await tx.stockMovement.create({ data: { companyId, productId: prod2.id, type: 'IN',  quantity: 10, reason: 'Achat initial',       stockBefore: 0,  stockAfter: 10, unitCost: 240000, totalCost: 2400000 } });
      await tx.stockMovement.create({ data: { companyId, productId: prod2.id, type: 'OUT', quantity: 2,  reason: 'Vente client',        stockBefore: 10, stockAfter: 8,  unitCost: 240000, totalCost: 480000  } });
      await tx.stockMovement.create({ data: { companyId, productId: prod3.id, type: 'IN',  quantity: 50, reason: 'Réapprovisionnement', stockBefore: 0,  stockAfter: 50, unitCost: 3500,   totalCost: 175000  } });

      // ── 21. POS : Caisse ──────────────────────────────────────────────────
      const regCode = `SEED-CASH-${companyId.slice(0, 6).toUpperCase()}`;
      const register = await tx.cashRegister.upsert({
        where: { code_companyId: { code: regCode, companyId } },
        update: {},
        create: { companyId, name: 'Caisse principale', code: regCode, location: 'Accueil', isActive: true },
      });

      // ── 22. POS : Session de caisse (une seule ouverte) ───────────────────
      const existingSession = await tx.cashSession.findFirst({ where: { companyId, registerId: register.id, status: 'OPEN' } });
      const session = existingSession ?? await tx.cashSession.create({
        data: { companyId, registerId: register.id, cashierId: emp4.id, openingAmount: 50000, status: 'OPEN', openedAt: d(0) },
      });

      // ── 23. POS : Ventes ──────────────────────────────────────────────────
      const saleNum = `SEED-POS-${companyId.slice(0, 6).toUpperCase()}-001`;
      const existingSale = await tx.sale.findFirst({ where: { companyId, saleNumber: saleNum } });
      if (!existingSale) {
        await tx.sale.create({
          data: {
            companyId, registerId: register.id, sessionId: session.id, cashierId: emp4.id,
            customerId: ct1.id, saleNumber: saleNum,
            subtotal: 320000, taxAmount: 57600, taxPercent: 18, total: 377600,
            paymentMethod: 'CASH', amountPaid: 400000, changeAmount: 22400, status: 'COMPLETED',
            items: { create: [{ productId: prod2.id, productName: prod2.name, productSku: prod2.sku ?? '', quantity: 1, unitPrice: 320000, taxPercent: 18, subtotal: 320000, total: 377600 }] },
          },
        });
      }

      // ── 24. Projets ───────────────────────────────────────────────────────
      const proj1Code = `SEED-PROJ-${companyId.slice(0, 6).toUpperCase()}-001`;
      const proj2Code = `SEED-PROJ-${companyId.slice(0, 6).toUpperCase()}-002`;

      let proj1 = await tx.project.findFirst({ where: { companyId, code: proj1Code } });
      if (!proj1) {
        proj1 = await tx.project.create({
          data: {
            companyId, createdById: ownerId, clientId: cc1.id,
            name: 'Refonte site TechCorp', code: proj1Code,
            status: 'IN_PROGRESS', priority: 'HIGH', progress: 35,
            budget: 2500000, currency: 'XOF', startDate: d(-15), endDate: d(45),
            members: { create: [{ employeeId: emp3.id, role: 'MANAGER' }, { employeeId: emp5.id, role: 'MEMBER' }] },
          },
        });
      }

      let proj2 = await tx.project.findFirst({ where: { companyId, code: proj2Code } });
      if (!proj2) {
        proj2 = await tx.project.create({
          data: {
            companyId, createdById: ownerId, clientId: cc2.id,
            name: 'Système Agro Solutions', code: proj2Code,
            status: 'PENDING', priority: 'URGENT', progress: 0,
            budget: 5000000, currency: 'XOF', startDate: d(5), endDate: d(90),
            members: { create: [{ employeeId: emp3.id, role: 'OWNER' }] },
          },
        });
      }

      // ── 25. Projets : Tâches ──────────────────────────────────────────────
      const existingTasks = await tx.task.findMany({ where: { projectId: proj1.id } });
      let task1: any, task2: any;
      if (existingTasks.length === 0) {
        task1 = await tx.task.create({ data: { companyId, projectId: proj1.id, createdById: ownerId, title: 'Maquettes UI/UX',         status: 'DONE',        priority: 'HIGH',   assigneeId: emp3.id, estimatedHours: 16, actualHours: 14, position: 0 } });
        task2 = await tx.task.create({ data: { companyId, projectId: proj1.id, createdById: ownerId, title: 'Développement frontend',  status: 'IN_PROGRESS', priority: 'HIGH',   assigneeId: emp3.id, estimatedHours: 40, actualHours: 12, position: 1, dueDate: d(20) } });
        await tx.task.create(        { data: { companyId, projectId: proj1.id, createdById: ownerId, title: 'Intégration API backend', status: 'TODO',        priority: 'MEDIUM', assigneeId: emp5.id, estimatedHours: 24, position: 2, dueDate: d(35) } });
        await tx.task.create(        { data: { companyId, projectId: proj2.id, createdById: ownerId, title: 'Analyse des besoins',     status: 'TODO',        priority: 'URGENT', assigneeId: emp3.id, estimatedHours: 8,  position: 0, dueDate: d(7)  } });
      } else {
        task1 = existingTasks.find((t) => t.title === 'Maquettes UI/UX') ?? existingTasks[0];
        task2 = existingTasks.find((t) => t.title === 'Développement frontend') ?? existingTasks[1] ?? existingTasks[0];
      }

      // ── 26. Projets : Time entries ────────────────────────────────────────
      const existingEntries = await tx.timeEntry.findMany({ where: { projectId: proj1.id, employeeId: emp3.id } });
      if (existingEntries.length === 0 && task1 && task2) {
        await tx.timeEntry.create({ data: { companyId, projectId: proj1.id, taskId: task1.id, employeeId: emp3.id, startTime: d(-10), endTime: d(-10), duration: 8, description: 'Création des maquettes Figma',    isBillable: true, hourlyRate: 15000 } });
        await tx.timeEntry.create({ data: { companyId, projectId: proj1.id, taskId: task2.id, employeeId: emp3.id, startTime: d(-3),  endTime: d(-3),  duration: 6, description: 'Développement composants React', isBillable: true, hourlyRate: 15000 } });
      }

      // ── 12. Comptabilité : Taux TVA ───────────────────────────────────────
      const tva18 = await tx.taxRate.findFirst({ where: { companyId, rate: 18 } })
        ?? await tx.taxRate.create({ data: { companyId, name: 'TVA 18%', rate: 18, isDefault: true } });
      await tx.taxRate.findFirst({ where: { companyId, rate: 0 } })
        ?? await tx.taxRate.create({ data: { companyId, name: 'Exonéré', rate: 0, isDefault: false } });

      // ── 13. Comptabilité : Fournisseurs ───────────────────────────────────
      const sup1 = await tx.supplier.upsert({ where: { name_companyId: { name: 'Fournitures Pro SARL', companyId } }, update: {}, create: { companyId, name: 'Fournitures Pro SARL', email: 'contact@fournitures-pro.bj', phone: '+22964000001' } });
      await tx.supplier.upsert({ where: { name_companyId: { name: 'Électronique Plus', companyId } }, update: {}, create: { companyId, name: 'Électronique Plus', email: 'info@elec-plus.bj', phone: '+22964000002' } });

      // ── 14. Comptabilité : Devis ──────────────────────────────────────────
      const devNum = `SEED-DEV-${companyId.slice(0, 6).toUpperCase()}-001`;
      if (!await tx.quote.findFirst({ where: { companyId, quoteNumber: devNum } })) {
        await tx.quote.create({
          data: {
            companyId, clientId: cc1.id, clientName: cc1.name, quoteNumber: devNum,
            status: 'SENT', subtotal: 2118644, taxAmount: 381356, total: 2500000, currency: 'XOF', expiryDate: d(30),
            items: { create: [{ description: 'Développement site web', quantity: 1, unitPrice: 2118644, taxRateId: tva18.id, taxAmount: 381356, total: 2500000, position: 0 }] },
          },
        });
      }

      // ── 15. Comptabilité : Factures ───────────────────────────────────────
      const fac1Num = `SEED-FAC-${companyId.slice(0, 6).toUpperCase()}-001`;
      const fac2Num = `SEED-FAC-${companyId.slice(0, 6).toUpperCase()}-002`;
      let inv2: any;
      if (!await tx.invoice.findFirst({ where: { companyId, invoiceNumber: fac1Num } })) {
        await tx.invoice.create({
          data: {
            companyId, clientId: cc2.id, clientName: cc2.name, invoiceNumber: fac1Num,
            status: 'SENT', subtotal: 4237288, taxAmount: 762712, total: 5000000, amountDue: 5000000, currency: 'XOF', dueDate: d(15),
            items: { create: [{ description: 'Système de gestion agricole', quantity: 1, unitPrice: 4237288, taxRateId: tva18.id, taxAmount: 762712, total: 5000000, position: 0 }] },
          },
        });
      }
      if (!await tx.invoice.findFirst({ where: { companyId, invoiceNumber: fac2Num } })) {
        inv2 = await tx.invoice.create({
          data: {
            companyId, clientId: cc1.id, clientName: cc1.name, invoiceNumber: fac2Num,
            status: 'PAID', subtotal: 847458, taxAmount: 152542, total: 1000000, amountDue: 0, amountPaid: 1000000, currency: 'XOF', paidAt: d(-10),
            items: { create: [{ description: 'Maintenance mensuelle', quantity: 1, unitPrice: 847458, taxRateId: tva18.id, taxAmount: 152542, total: 1000000, position: 0 }] },
          },
        });
        await tx.payment.create({ data: { companyId, invoiceId: inv2.id, amount: 1000000, currency: 'XOF', method: 'BANK_TRANSFER', reference: `SEED-VIR-${companyId.slice(0,6)}`, paidAt: d(-10) } });
      }

      // ── 17. Comptabilité : Charges fournisseurs ───────────────────────────
      const billNum = `SEED-BILL-${companyId.slice(0, 6).toUpperCase()}-001`;
      if (!await tx.bill.findFirst({ where: { companyId, billNumber: billNum } })) {
        await tx.bill.create({
          data: {
            companyId, supplierId: sup1.id, supplierName: sup1.name, billNumber: billNum,
            status: 'PENDING', subtotal: 169492, taxAmount: 30508, total: 200000, currency: 'XOF', dueDate: d(20),
            items: { create: [{ description: 'Fournitures de bureau', quantity: 10, unitPrice: 16949, taxRateId: tva18.id, taxAmount: 30508, total: 200000, position: 0 }] },
          },
        });
      }

      return {
        message: 'Données de test créées avec succès',
        summary: {
          employees: 8, departments: 5, positions: 8,
          contacts: 3, clientCompanies: 2, opportunities: 2, activities: 3,
          invoices: 2, quotes: 1, bills: 1, products: 3, stockMovements: 4,
          projects: 2, tasks: 4, timeEntries: 2, cashRegisters: 1,
        },
      };
    }, { timeout: 60000 });
  }
}
