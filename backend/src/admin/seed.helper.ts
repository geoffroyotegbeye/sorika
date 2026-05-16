import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

export async function runSeed(prisma: PrismaService, companyId: string) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { members: { include: { user: true }, take: 1 } },
  });
  if (!company) throw new NotFoundException('Entreprise introuvable');

  const ownerId = company.members[0]?.userId;
  if (!ownerId) throw new BadRequestException('Aucun membre trouvé pour cette organisation');

  const today = new Date();
  const d = (offset: number) =>
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
  const dt = (offset: number, h = 8, m = 0) => {
    const x = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    x.setHours(h, m, 0, 0);
    return x;
  };

  return prisma.$transaction(async (tx) => {

    // ── 1. RH : Positions ────────────────────────────────────────────────────
    const [posDG, posCFO, posRH, posDev, posDevJr, posComm, posCompta, posStage] =
      await Promise.all([
        tx.position.upsert({ where: { companyId_title: { companyId, title: 'Directeur Général' } },   update: {}, create: { companyId, title: 'Directeur Général',   level: 'EXECUTIVE', description: 'Direction et stratégie' } }),
        tx.position.upsert({ where: { companyId_title: { companyId, title: 'Directeur Financier' } }, update: {}, create: { companyId, title: 'Directeur Financier', level: 'EXECUTIVE', description: 'Gestion financière' } }),
        tx.position.upsert({ where: { companyId_title: { companyId, title: 'Responsable RH' } },      update: {}, create: { companyId, title: 'Responsable RH',      level: 'MANAGER',   description: 'Gestion des ressources humaines' } }),
        tx.position.upsert({ where: { companyId_title: { companyId, title: 'Développeur Senior' } },  update: {}, create: { companyId, title: 'Développeur Senior',  level: 'STAFF',     description: 'Développement logiciel senior' } }),
        tx.position.upsert({ where: { companyId_title: { companyId, title: 'Développeur Junior' } },  update: {}, create: { companyId, title: 'Développeur Junior',  level: 'STAFF',     description: 'Développement logiciel junior' } }),
        tx.position.upsert({ where: { companyId_title: { companyId, title: 'Commercial' } },          update: {}, create: { companyId, title: 'Commercial',          level: 'STAFF',     description: 'Ventes et prospection' } }),
        tx.position.upsert({ where: { companyId_title: { companyId, title: 'Comptable' } },           update: {}, create: { companyId, title: 'Comptable',           level: 'STAFF',     description: 'Gestion comptable' } }),
        tx.position.upsert({ where: { companyId_title: { companyId, title: 'Stagiaire' } },           update: {}, create: { companyId, title: 'Stagiaire',           level: 'INTERN',    description: 'Stage de formation' } }),
      ]);

    // ── 2. RH : Départements ─────────────────────────────────────────────────
    const [deptDir, deptRH, deptTech, deptComm, deptFinance] = await Promise.all([
      tx.department.upsert({ where: { companyId_name: { companyId, name: 'Direction' } },           update: {}, create: { companyId, name: 'Direction',           description: 'Direction générale' } }),
      tx.department.upsert({ where: { companyId_name: { companyId, name: 'Ressources Humaines' } }, update: {}, create: { companyId, name: 'Ressources Humaines', description: 'Gestion du personnel' } }),
      tx.department.upsert({ where: { companyId_name: { companyId, name: 'Technique' } },           update: {}, create: { companyId, name: 'Technique',           description: 'Développement et IT' } }),
      tx.department.upsert({ where: { companyId_name: { companyId, name: 'Commercial' } },          update: {}, create: { companyId, name: 'Commercial',          description: 'Ventes et marketing' } }),
      tx.department.upsert({ where: { companyId_name: { companyId, name: 'Finance' } },             update: {}, create: { companyId, name: 'Finance',             description: 'Comptabilité et finance' } }),
    ]);

    // ── 3. RH : Employés (8 avec hiérarchie) ────────────────────────────────
    const emp1 = await tx.employee.create({ data: { companyId, firstName: 'Kofi',  lastName: 'Mensah',  positionId: posDG.id,     departmentId: deptDir.id,     contractType: 'CDI',   baseSalary: 850000, hireDate: d(-730), isActive: true } });
    const emp2 = await tx.employee.create({ data: { companyId, firstName: 'Ama',   lastName: 'Diallo',  positionId: posRH.id,     departmentId: deptRH.id,      contractType: 'CDI',   baseSalary: 450000, hireDate: d(-365), isActive: true, managerId: emp1.id } });
    const emp3 = await tx.employee.create({ data: { companyId, firstName: 'Kwame', lastName: 'Asante',  positionId: posDev.id,    departmentId: deptTech.id,    contractType: 'CDI',   baseSalary: 550000, hireDate: d(-180), isActive: true, managerId: emp1.id } });
    const emp4 = await tx.employee.create({ data: { companyId, firstName: 'Fatou', lastName: 'Traoré',  positionId: posComm.id,   departmentId: deptComm.id,    contractType: 'CDD',   baseSalary: 320000, hireDate: d(-90),  isActive: true, managerId: emp1.id } });
    const emp5 = await tx.employee.create({ data: { companyId, firstName: 'Yao',   lastName: 'Kouassi', positionId: posDevJr.id,  departmentId: deptTech.id,    contractType: 'CDI',   baseSalary: 280000, hireDate: d(-60),  isActive: true, managerId: emp3.id } });
    const emp6 = await tx.employee.create({ data: { companyId, firstName: 'Adjoa', lastName: 'Mensah',  positionId: posCompta.id, departmentId: deptFinance.id, contractType: 'CDI',   baseSalary: 380000, hireDate: d(-200), isActive: true, managerId: emp1.id } });
    const emp7 = await tx.employee.create({ data: { companyId, firstName: 'Sekou', lastName: 'Camara',  positionId: posComm.id,   departmentId: deptComm.id,    contractType: 'CDI',   baseSalary: 310000, hireDate: d(-120), isActive: true, managerId: emp4.id } });
    const emp8 = await tx.employee.create({ data: { companyId, firstName: 'Abena', lastName: 'Owusu',   positionId: posStage.id,  departmentId: deptTech.id,    contractType: 'STAGE', baseSalary: 80000,  hireDate: d(-30),  isActive: true, managerId: emp3.id } });

    // ── 4. RH : Types de congés ──────────────────────────────────────────────
    const [ltCP, ltRTT, ltSick, ltUnpaid] = await Promise.all([
      tx.leaveType.upsert({ where: { companyId_code: { companyId, code: 'CP' } },     update: {}, create: { companyId, name: 'Congé payé',    code: 'CP',     isPaid: true,  requiresApproval: true,  color: '#3b82f6' } }),
      tx.leaveType.upsert({ where: { companyId_code: { companyId, code: 'RTT' } },    update: {}, create: { companyId, name: 'RTT',           code: 'RTT',    isPaid: true,  requiresApproval: true,  color: '#8b5cf6' } }),
      tx.leaveType.upsert({ where: { companyId_code: { companyId, code: 'SICK' } },   update: {}, create: { companyId, name: 'Congé maladie', code: 'SICK',   isPaid: false, requiresApproval: false, color: '#ef4444' } }),
      tx.leaveType.upsert({ where: { companyId_code: { companyId, code: 'UNPAID' } }, update: {}, create: { companyId, name: 'Sans solde',    code: 'UNPAID', isPaid: false, requiresApproval: true,  color: '#f59e0b' } }),
    ]);

    // ── 5. RH : Soldes de congés ─────────────────────────────────────────────
    const year = today.getFullYear();
    for (const [emp, cpUsed, rttUsed] of [
      [emp1,8,3],[emp2,5,2],[emp3,3,1],[emp4,2,0],
      [emp5,0,0],[emp6,4,2],[emp7,1,0],[emp8,0,0],
    ] as [any, number, number][]) {
      await tx.leaveBalance.upsert({ where: { employeeId_leaveTypeId_year: { employeeId: emp.id, leaveTypeId: ltCP.id,  year } }, update: {}, create: { employeeId: emp.id, leaveTypeId: ltCP.id,  year, total: 25, used: cpUsed,  remaining: 25 - cpUsed  } });
      await tx.leaveBalance.upsert({ where: { employeeId_leaveTypeId_year: { employeeId: emp.id, leaveTypeId: ltRTT.id, year } }, update: {}, create: { employeeId: emp.id, leaveTypeId: ltRTT.id, year, total: 10, used: rttUsed, remaining: 10 - rttUsed } });
    }

    // ── 6. RH : Congés ───────────────────────────────────────────────────────
    await tx.leave.create({ data: { companyId, employeeId: emp2.id, leaveTypeId: ltCP.id,     startDate: d(10),  endDate: d(17),  days: 5, reason: 'Vacances annuelles', status: 'APPROVED', approvedBy: ownerId, approvedAt: d(-2)  } });
    await tx.leave.create({ data: { companyId, employeeId: emp3.id, leaveTypeId: ltRTT.id,    startDate: d(5),   endDate: d(6),   days: 2, reason: 'RTT récupération',   status: 'PENDING'  } });
    await tx.leave.create({ data: { companyId, employeeId: emp4.id, leaveTypeId: ltSick.id,   startDate: d(-5),  endDate: d(-3),  days: 3, reason: 'Maladie',            status: 'APPROVED', approvedBy: ownerId, approvedAt: d(-6)  } });
    await tx.leave.create({ data: { companyId, employeeId: emp6.id, leaveTypeId: ltCP.id,     startDate: d(-30), endDate: d(-24), days: 5, reason: 'Congé annuel',       status: 'APPROVED', approvedBy: ownerId, approvedAt: d(-35) } });
    await tx.leave.create({ data: { companyId, employeeId: emp7.id, leaveTypeId: ltUnpaid.id, startDate: d(20),  endDate: d(22),  days: 3, reason: 'Raison personnelle', status: 'PENDING'  } });
    await tx.leave.create({ data: { companyId, employeeId: emp1.id, leaveTypeId: ltCP.id,     startDate: d(-60), endDate: d(-53), days: 6, reason: 'Vacances été',       status: 'APPROVED', approvedBy: ownerId, approvedAt: d(-65) } });

    // ── 7. RH : Présences (30 jours ouvrés) ─────────────────────────────────
    for (let i = 30; i >= 1; i--) {
      const date = d(-i);
      if (date.getDay() === 0 || date.getDay() === 6) continue;
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
          create: {
            companyId, employeeId: emp.id, date,
            checkIn:     status !== 'ABSENT' ? checkIn  : null,
            checkOut:    status !== 'ABSENT' ? checkOut : null,
            status,
            hoursWorked: status !== 'ABSENT' ? (hOut - hIn) : 0,
          },
        });
      }
    }

    // ── 8. RH : Notes de frais ───────────────────────────────────────────────
    await tx.expense.create({ data: { companyId, employeeId: emp4.id, title: 'Déplacement client Cotonou', description: 'Taxi + repas client TechCorp', amount: 45000,  currency: 'XOF', category: 'TRANSPORT',     date: d(-15), status: 'APPROVED',   approvedBy: ownerId, approvedAt: d(-14) } });
    await tx.expense.create({ data: { companyId, employeeId: emp3.id, title: 'Achat matériel dev',         description: 'Câbles et adaptateurs USB',    amount: 28000,  currency: 'XOF', category: 'OTHER',         date: d(-10), status: 'APPROVED',   approvedBy: ownerId, approvedAt: d(-9)  } });
    await tx.expense.create({ data: { companyId, employeeId: emp7.id, title: 'Repas prospect Lomé',        description: 'Déjeuner avec prospect Agro',  amount: 35000,  currency: 'XOF', category: 'MEAL',          date: d(-5),  status: 'PENDING'  } });
    await tx.expense.create({ data: { companyId, employeeId: emp6.id, title: 'Formation comptabilité',     description: 'Séminaire OHADA 2 jours',      amount: 150000, currency: 'XOF', category: 'OTHER',         date: d(-20), status: 'APPROVED',   approvedBy: ownerId, approvedAt: d(-18) } });
    await tx.expense.create({ data: { companyId, employeeId: emp2.id, title: 'Hébergement déplacement RH', description: 'Hôtel conférence RH Abidjan',  amount: 85000,  currency: 'XOF', category: 'ACCOMMODATION', date: d(-45), status: 'REIMBURSED', approvedBy: ownerId, reimbursedAt: d(-40) } });

    // ── 9. RH : Jours fériés ────────────────────────────────────────────────
    for (const [name, month, day] of [
      ["Jour de l'An", 0, 1], ['Fête du Travail', 4, 1], ["Fête de l'Indépendance", 7, 1],
      ['Fête Nationale', 10, 30], ['Noël', 11, 25], ['Lundi de Pâques', 3, 21],
      ['Assomption', 7, 15], ['Toussaint', 10, 1],
    ] as [string, number, number][]) {
      const existing = await tx.publicHoliday.findFirst({ where: { companyId, name } });
      if (!existing) await tx.publicHoliday.create({ data: { companyId, name, date: new Date(year, month, day), isRecurring: true } });
    }

    // ── 10. CRM : Entreprises clientes ──────────────────────────────────────
    const [cc1, cc2, cc3, cc4, cc5] = await Promise.all([
      tx.clientCompany.upsert({ where: { name_organizationId: { name: 'TechCorp Afrique',  organizationId: companyId } }, update: {}, create: { organizationId: companyId, ownerId, name: 'TechCorp Afrique',  industry: 'Technologie', size: 'MEDIUM',     website: 'https://techcorp.bj',   phone: '+22961000001', notes: 'Client stratégique depuis 2024' } }),
      tx.clientCompany.upsert({ where: { name_organizationId: { name: 'Agro Solutions SA', organizationId: companyId } }, update: {}, create: { organizationId: companyId, ownerId, name: 'Agro Solutions SA', industry: 'Agriculture', size: 'LARGE',      website: 'https://agro.bj',       phone: '+22961000002', notes: 'Budget annuel 10M XOF' } }),
      tx.clientCompany.upsert({ where: { name_organizationId: { name: 'BanqueOuest SARL',  organizationId: companyId } }, update: {}, create: { organizationId: companyId, ownerId, name: 'BanqueOuest SARL',  industry: 'Finance',     size: 'ENTERPRISE', website: 'https://banqueouest.bj', phone: '+22961000003' } }),
      tx.clientCompany.upsert({ where: { name_organizationId: { name: 'LogiTrans Bénin',   organizationId: companyId } }, update: {}, create: { organizationId: companyId, ownerId, name: 'LogiTrans Bénin',   industry: 'Transport',   size: 'SMALL',      phone: '+22961000004' } }),
      tx.clientCompany.upsert({ where: { name_organizationId: { name: 'HealthCare Plus',   organizationId: companyId } }, update: {}, create: { organizationId: companyId, ownerId, name: 'HealthCare Plus',   industry: 'Santé',       size: 'MEDIUM',     website: 'https://hcplus.bj',     phone: '+22961000005' } }),
    ]);

    // ── 11. CRM : Contacts ───────────────────────────────────────────────────
    const [ct1, ct2, ct3, ct4, ct5, ct6] = await Promise.all([
      tx.contact.upsert({ where: { email_organizationId: { email: 'jean.dupont@techcorp.bj', organizationId: companyId } }, update: {}, create: { organizationId: companyId, ownerId, firstName: 'Jean',    lastName: 'Dupont', email: 'jean.dupont@techcorp.bj', phone: '+22961111111', status: 'CLIENT',   companyId: cc1.id, source: 'REFERRAL',    tags: ['vip', 'tech'] } }),
      tx.contact.upsert({ where: { email_organizationId: { email: 'marie.kone@agro.bj',      organizationId: companyId } }, update: {}, create: { organizationId: companyId, ownerId, firstName: 'Marie',   lastName: 'Koné',   email: 'marie.kone@agro.bj',      phone: '+22962222222', status: 'PROSPECT', companyId: cc2.id, source: 'WEBSITE',     tags: ['agriculture'] } }),
      tx.contact.upsert({ where: { email_organizationId: { email: 'paul.addo@gmail.com',      organizationId: companyId } }, update: {}, create: { organizationId: companyId, ownerId, firstName: 'Paul',    lastName: 'Addo',   email: 'paul.addo@gmail.com',      phone: '+22963333333', status: 'LEAD',     source: 'SOCIAL_MEDIA' } }),
      tx.contact.upsert({ where: { email_organizationId: { email: 'alice.bah@banqueouest.bj', organizationId: companyId } }, update: {}, create: { organizationId: companyId, ownerId, firstName: 'Alice',   lastName: 'Bah',    email: 'alice.bah@banqueouest.bj', phone: '+22964444444', status: 'CLIENT',   companyId: cc3.id, source: 'REFERRAL',    tags: ['finance', 'vip'] } }),
      tx.contact.upsert({ where: { email_organizationId: { email: 'omar.sy@logitrans.bj',     organizationId: companyId } }, update: {}, create: { organizationId: companyId, ownerId, firstName: 'Omar',    lastName: 'Sy',     email: 'omar.sy@logitrans.bj',     phone: '+22965555555', status: 'PROSPECT', companyId: cc4.id, source: 'EVENT' } }),
      tx.contact.upsert({ where: { email_organizationId: { email: 'grace.atta@hcplus.bj',     organizationId: companyId } }, update: {}, create: { organizationId: companyId, ownerId, firstName: 'Grace',   lastName: 'Atta',   email: 'grace.atta@hcplus.bj',     phone: '+22966666666', status: 'LEAD',     companyId: cc5.id, source: 'WEBSITE' } }),
    ]);
    await tx.contact.upsert({ where: { email_organizationId: { email: 'ibrahim.toure@gmail.com', organizationId: companyId } }, update: {}, create: { organizationId: companyId, ownerId, firstName: 'Ibrahim', lastName: 'Touré', email: 'ibrahim.toure@gmail.com', phone: '+22967777777', status: 'LEAD',    source: 'SOCIAL_MEDIA' } });
    await tx.contact.upsert({ where: { email_organizationId: { email: 'nadia.fall@gmail.com',    organizationId: companyId } }, update: {}, create: { organizationId: companyId, ownerId, firstName: 'Nadia',   lastName: 'Fall',  email: 'nadia.fall@gmail.com',    phone: '+22968888888', status: 'PARTNER', source: 'REFERRAL' } });

    // ── 12. CRM : Opportunités (pipeline complet) ────────────────────────────
    const [opp1, opp2, opp3] = await Promise.all([
      tx.opportunity.create({ data: { organizationId: companyId, ownerId, title: 'Refonte site web TechCorp',     amount: 2500000, currency: 'XOF', stage: 'PROPOSAL',    probability: 60,  contactId: ct1.id, companyId: cc1.id, expectedCloseDate: d(30), notes: 'Proposition envoyée, attente retour' } }),
      tx.opportunity.create({ data: { organizationId: companyId, ownerId, title: 'Système de gestion Agro',       amount: 5000000, currency: 'XOF', stage: 'NEGOTIATION', probability: 75,  contactId: ct2.id, companyId: cc2.id, expectedCloseDate: d(15), notes: 'Négociation en cours sur le prix' } }),
      tx.opportunity.create({ data: { organizationId: companyId, ownerId, title: 'Audit SI BanqueOuest',          amount: 3200000, currency: 'XOF', stage: 'QUALIFIED',   probability: 40,  contactId: ct4.id, companyId: cc3.id, expectedCloseDate: d(45) } }),
    ]);
    await tx.opportunity.create({ data: { organizationId: companyId, ownerId, title: 'App mobile LogiTrans',          amount: 1800000, currency: 'XOF', stage: 'LEAD',        probability: 20,  contactId: ct5.id, companyId: cc4.id, expectedCloseDate: d(60) } });
    await tx.opportunity.create({ data: { organizationId: companyId, ownerId, title: 'Maintenance annuelle TechCorp', amount: 1200000, currency: 'XOF', stage: 'WON',         probability: 100, contactId: ct1.id, companyId: cc1.id, actualCloseDate: d(-5),  notes: 'Contrat signé !' } });
    await tx.opportunity.create({ data: { organizationId: companyId, ownerId, title: 'ERP HealthCare Plus',           amount: 8000000, currency: 'XOF', stage: 'LOST',        probability: 0,   contactId: ct6.id, companyId: cc5.id, actualCloseDate: d(-20), lostReason: 'Budget insuffisant, reporté à 2027' } });

    // ── 13. CRM : Activités ──────────────────────────────────────────────────
    await tx.activity.create({ data: { organizationId: companyId, ownerId, type: 'CALL',    subject: 'Appel de qualification TechCorp',   contactId: ct1.id, opportunityId: opp1.id, status: 'COMPLETED', completedAt: d(-15), duration: 30 } });
    await tx.activity.create({ data: { organizationId: companyId, ownerId, type: 'EMAIL',   subject: 'Envoi proposition commerciale',      contactId: ct1.id, opportunityId: opp1.id, status: 'COMPLETED', completedAt: d(-10) } });
    await tx.activity.create({ data: { organizationId: companyId, ownerId, type: 'MEETING', subject: 'Présentation solution Agro',         contactId: ct2.id, opportunityId: opp2.id, status: 'COMPLETED', completedAt: d(-7),  duration: 90 } });
    await tx.activity.create({ data: { organizationId: companyId, ownerId, type: 'CALL',    subject: 'Suivi négociation Agro',            contactId: ct2.id, opportunityId: opp2.id, status: 'PLANNED',   dueDate: d(2) } });
    await tx.activity.create({ data: { organizationId: companyId, ownerId, type: 'MEETING', subject: 'RDV découverte BanqueOuest',        contactId: ct4.id, opportunityId: opp3.id, status: 'PLANNED',   dueDate: d(5), duration: 60 } });
    await tx.activity.create({ data: { organizationId: companyId, ownerId, type: 'EMAIL',   subject: 'Prise de contact LogiTrans',        contactId: ct5.id, status: 'COMPLETED', completedAt: d(-3) } });
    await tx.activity.create({ data: { organizationId: companyId, ownerId, type: 'TASK',    subject: 'Préparer démo pour HealthCare',     contactId: ct6.id, status: 'PLANNED',   dueDate: d(1) } });
    await tx.activity.create({ data: { organizationId: companyId, ownerId, type: 'NOTE',    subject: 'Notes réunion interne pipeline Q2', status: 'COMPLETED', completedAt: d(-1) } });

    // ── 14. Comptabilité : TVA & Fournisseurs ────────────────────────────────
    const tva18 = await tx.taxRate.findFirst({ where: { companyId, rate: 18 } })
      ?? await tx.taxRate.create({ data: { companyId, name: 'TVA 18%', rate: 18, isDefault: true  } });
    await (tx.taxRate.findFirst({ where: { companyId, rate: 0 } })
      .then(r => r ?? tx.taxRate.create({ data: { companyId, name: 'Exonéré', rate: 0, isDefault: false } })));

    const [sup1, sup2, sup3] = await Promise.all([
      tx.supplier.upsert({ where: { name_companyId: { name: 'Fournitures Pro SARL', companyId } }, update: {}, create: { companyId, name: 'Fournitures Pro SARL', email: 'contact@fournitures-pro.bj', phone: '+22964000001', taxNumber: 'RCCM-BJ-001' } }),
            tx.supplier.upsert({ where: { name_companyId: { name: 'Électronique Plus',    companyId } }, update: {}, create: { companyId, name: 'Électronique Plus',    email: 'info@elec-plus.bj',        phone: '+22964000002' } }),
      tx.supplier.upsert({ where: { name_companyId: { name: 'Cloud Services SA',    companyId } }, update: {}, create: { companyId, name: 'Cloud Services SA',    email: 'billing@cloudservices.bj', phone: '+22964000003', notes: 'Hébergement cloud' } }),
    ]);

    // ── 15. Comptabilité : Devis ─────────────────────────────────────────────
    const devBase = `SEED-DEV-${companyId.slice(0, 6).toUpperCase()}`;
    if (!await tx.quote.findFirst({ where: { companyId, quoteNumber: `${devBase}-001` } })) {
      await tx.quote.create({ data: { companyId, clientId: cc1.id, clientName: cc1.name, quoteNumber: `${devBase}-001`, status: 'SENT',     subtotal: 2118644, taxAmount: 381356, total: 2500000, currency: 'XOF', expiryDate: d(30),  issueDate: d(-5),  items: { create: [{ description: 'Développement site web',      quantity: 1, unitPrice: 2118644, taxRateId: tva18.id, taxAmount: 381356, total: 2500000, position: 0 }] } } });
      await tx.quote.create({ data: { companyId, clientId: cc3.id, clientName: cc3.name, quoteNumber: `${devBase}-002`, status: 'ACCEPTED', subtotal: 2711864, taxAmount: 488136, total: 3200000, currency: 'XOF', expiryDate: d(10),  issueDate: d(-20), items: { create: [{ description: 'Audit système informatique',   quantity: 1, unitPrice: 2711864, taxRateId: tva18.id, taxAmount: 488136, total: 3200000, position: 0 }] } } });
      await tx.quote.create({ data: { companyId, clientId: cc4.id, clientName: cc4.name, quoteNumber: `${devBase}-003`, status: 'DRAFT',    subtotal: 1525424, taxAmount: 274576, total: 1800000, currency: 'XOF', expiryDate: d(45),  issueDate: d(0),   items: { create: [{ description: 'Application mobile',          quantity: 1, unitPrice: 1525424, taxRateId: tva18.id, taxAmount: 274576, total: 1800000, position: 0 }] } } });
      await tx.quote.create({ data: { companyId, clientId: cc2.id, clientName: cc2.name, quoteNumber: `${devBase}-004`, status: 'REFUSED',  subtotal: 4237288, taxAmount: 762712, total: 5000000, currency: 'XOF', expiryDate: d(-10), issueDate: d(-45), items: { create: [{ description: 'Système ERP agricole v1',      quantity: 1, unitPrice: 4237288, taxRateId: tva18.id, taxAmount: 762712, total: 5000000, position: 0 }] } } });
    }

    // ── 16. Comptabilité : Factures ──────────────────────────────────────────
    const facBase = `SEED-FAC-${companyId.slice(0, 6).toUpperCase()}`;
    if (!await tx.invoice.findFirst({ where: { companyId, invoiceNumber: `${facBase}-001` } })) {
      await tx.invoice.create({ data: { companyId, clientId: cc2.id, clientName: cc2.name, invoiceNumber: `${facBase}-001`, status: 'SENT',    subtotal: 4237288, taxAmount: 762712, total: 5000000, amountDue: 5000000, amountPaid: 0,       currency: 'XOF', dueDate: d(15),  issueDate: d(-5),  items: { create: [{ description: 'Système gestion agricole phase 1', quantity: 1, unitPrice: 4237288, taxRateId: tva18.id, taxAmount: 762712, total: 5000000, position: 0 }] } } });

      const inv2 = await tx.invoice.create({ data: { companyId, clientId: cc1.id, clientName: cc1.name, invoiceNumber: `${facBase}-002`, status: 'PAID',    subtotal: 847458,  taxAmount: 152542, total: 1000000, amountDue: 0,       amountPaid: 1000000, currency: 'XOF', dueDate: d(-5),  issueDate: d(-20), paidAt: d(-10), items: { create: [{ description: 'Maintenance mensuelle mai 2026',     quantity: 1, unitPrice: 847458,  taxRateId: tva18.id, taxAmount: 152542, total: 1000000, position: 0 }] } } });
      await tx.payment.create({ data: { companyId, invoiceId: inv2.id, amount: 1000000, currency: 'XOF', method: 'BANK_TRANSFER', reference: `VIR-${companyId.slice(0,6)}-001`, paidAt: d(-10) } });

      await tx.invoice.create({ data: { companyId, clientId: cc3.id, clientName: cc3.name, invoiceNumber: `${facBase}-003`, status: 'OVERDUE', subtotal: 2711864, taxAmount: 488136, total: 3200000, amountDue: 3200000, amountPaid: 0,       currency: 'XOF', dueDate: d(-10), issueDate: d(-40), items: { create: [{ description: 'Audit SI BanqueOuest',               quantity: 1, unitPrice: 2711864, taxRateId: tva18.id, taxAmount: 488136, total: 3200000, position: 0 }] } } });

      const inv4 = await tx.invoice.create({ data: { companyId, clientId: cc1.id, clientName: cc1.name, invoiceNumber: `${facBase}-004`, status: 'PARTIAL', subtotal: 1694915, taxAmount: 305085, total: 2000000, amountDue: 1000000, amountPaid: 1000000, currency: 'XOF', dueDate: d(20),  issueDate: d(-15), items: { create: [{ description: 'Développement module CRM',          quantity: 1, unitPrice: 1694915, taxRateId: tva18.id, taxAmount: 305085, total: 2000000, position: 0 }] } } });
      await tx.payment.create({ data: { companyId, invoiceId: inv4.id, amount: 1000000, currency: 'XOF', method: 'MOBILE_MONEY', reference: 'MTN-2026-001', paidAt: d(-5) } });

      const inv5 = await tx.invoice.create({ data: { companyId, clientId: cc2.id, clientName: cc2.name, invoiceNumber: `${facBase}-005`, status: 'PAID',    subtotal: 847458,  taxAmount: 152542, total: 1000000, amountDue: 0,       amountPaid: 1000000, currency: 'XOF', dueDate: d(-50), issueDate: d(-65), paidAt: d(-55), items: { create: [{ description: 'Maintenance mensuelle mars 2026',    quantity: 1, unitPrice: 847458,  taxRateId: tva18.id, taxAmount: 152542, total: 1000000, position: 0 }] } } });
      await tx.payment.create({ data: { companyId, invoiceId: inv5.id, amount: 1000000, currency: 'XOF', method: 'CASH', paidAt: d(-55) } });
    }

    // ── 17. Comptabilité : Charges fournisseurs ──────────────────────────────
    const billBase = `SEED-BILL-${companyId.slice(0, 6).toUpperCase()}`;
    if (!await tx.bill.findFirst({ where: { companyId, billNumber: `${billBase}-001` } })) {
      await tx.bill.create({ data: { companyId, supplierId: sup1.id, supplierName: sup1.name, billNumber: `${billBase}-001`, status: 'PENDING',  subtotal: 169492, taxAmount: 30508, total: 200000, currency: 'XOF', dueDate: d(20),  issueDate: d(-5),  items: { create: [{ description: 'Fournitures de bureau Q2',  quantity: 10, unitPrice: 16949, taxRateId: tva18.id, taxAmount: 30508, total: 200000, position: 0 }] } } });
      await tx.bill.create({ data: { companyId, supplierId: sup2.id, supplierName: sup2.name, billNumber: `${billBase}-002`, status: 'PAID',     subtotal: 423729, taxAmount: 76271, total: 500000, currency: 'XOF', dueDate: d(-20), issueDate: d(-35), paidAt: d(-25), items: { create: [{ description: 'Matériel informatique',     quantity: 2,  unitPrice: 211864, taxRateId: tva18.id, taxAmount: 76271, total: 500000, position: 0 }] } } });
      await tx.bill.create({ data: { companyId, supplierId: sup3.id, supplierName: sup3.name, billNumber: `${billBase}-003`, status: 'APPROVED', subtotal: 254237, taxAmount: 45763, total: 300000, currency: 'XOF', dueDate: d(5),   issueDate: d(-10), items: { create: [{ description: 'Hébergement cloud mensuel', quantity: 1,  unitPrice: 254237, taxRateId: tva18.id, taxAmount: 45763, total: 300000, position: 0 }] } } });
    }

    // ── 18. Inventaire : Catégories ──────────────────────────────────────────
    const [catElec, catBureau, catInfo, catConsomm] = await Promise.all([
      tx.productCategory.upsert({ where: { name_companyId: { name: 'Électronique',       companyId } }, update: {}, create: { companyId, name: 'Électronique',       description: 'Matériel électronique' } }),
      tx.productCategory.upsert({ where: { name_companyId: { name: 'Fournitures bureau', companyId } }, update: {}, create: { companyId, name: 'Fournitures bureau', description: 'Articles de bureau'    } }),
      tx.productCategory.upsert({ where: { name_companyId: { name: 'Informatique',       companyId } }, update: {}, create: { companyId, name: 'Informatique',       description: 'Matériel informatique' } }),
      tx.productCategory.upsert({ where: { name_companyId: { name: 'Consommables',       companyId } }, update: {}, create: { companyId, name: 'Consommables',       description: 'Consommables divers'   } }),
    ]);

    // ── 19. Inventaire : Produits ────────────────────────────────────────────
    const [prod1, prod2, prod3, prod4, prod5] = await Promise.all([
      tx.inventoryProduct.upsert({ where: { sku_companyId: { sku: 'DELL-XPS-001',  companyId } }, update: {}, create: { companyId, categoryId: catInfo.id,    name: 'Laptop Dell XPS 15',  sku: 'DELL-XPS-001',  salePrice: 850000, costPrice: 650000, stockQuantity: 5,  minStock: 2,  unit: 'pièce',   isActive: true, description: 'Laptop pro 15 pouces' } }),
      tx.inventoryProduct.upsert({ where: { sku_companyId: { sku: 'SCREEN-4K-001', companyId } }, update: {}, create: { companyId, categoryId: catElec.id,    name: 'Écran 27" 4K',        sku: 'SCREEN-4K-001', salePrice: 320000, costPrice: 240000, stockQuantity: 8,  minStock: 3,  unit: 'pièce',   isActive: true } }),
      tx.inventoryProduct.upsert({ where: { sku_companyId: { sku: 'PAPER-A4-001',  companyId } }, update: {}, create: { companyId, categoryId: catBureau.id,  name: 'Ramette papier A4',   sku: 'PAPER-A4-001',  salePrice: 5000,   costPrice: 3500,   stockQuantity: 50, minStock: 10, unit: 'ramette', isActive: true } }),
      tx.inventoryProduct.upsert({ where: { sku_companyId: { sku: 'MOUSE-LOG-001', companyId } }, update: {}, create: { companyId, categoryId: catElec.id,    name: 'Souris Logitech MX',  sku: 'MOUSE-LOG-001', salePrice: 45000,  costPrice: 32000,  stockQuantity: 15, minStock: 5,  unit: 'pièce',   isActive: true } }),
      tx.inventoryProduct.upsert({ where: { sku_companyId: { sku: 'INK-HP-001',    companyId } }, update: {}, create: { companyId, categoryId: catConsomm.id, name: 'Cartouche HP 305',    sku: 'INK-HP-001',    salePrice: 18000,  costPrice: 12000,  stockQuantity: 20, minStock: 5,  unit: 'pièce',   isActive: true } }),
    ]);
    await Promise.all([
      tx.inventoryProduct.upsert({ where: { sku_companyId: { sku: 'KB-MECH-001',   companyId } }, update: {}, create: { companyId, categoryId: catElec.id,   name: 'Clavier mécanique',   sku: 'KB-MECH-001',   salePrice: 65000,  costPrice: 45000,  stockQuantity: 0,  minStock: 3,  unit: 'pièce',   isActive: true } }),
      tx.inventoryProduct.upsert({ where: { sku_companyId: { sku: 'USB-HUB-001',   companyId } }, update: {}, create: { companyId, categoryId: catElec.id,   name: 'Hub USB-C 7 ports',   sku: 'USB-HUB-001',   salePrice: 28000,  costPrice: 18000,  stockQuantity: 12, minStock: 4,  unit: 'pièce',   isActive: true } }),
      tx.inventoryProduct.upsert({ where: { sku_companyId: { sku: 'CHAIR-ERG-001', companyId } }, update: {}, create: { companyId, categoryId: catBureau.id, name: 'Chaise ergonomique',  sku: 'CHAIR-ERG-001', salePrice: 185000, costPrice: 130000, stockQuantity: 3,  minStock: 1,  unit: 'pièce',   isActive: true } }),
    ]);

    // ── 20. Inventaire : Mouvements de stock ────────────────────────────────
    await tx.stockMovement.create({ data: { companyId, productId: prod1.id, type: 'IN',         quantity: 5,  reason: 'Achat initial',         stockBefore: 0,  stockAfter: 5,  unitCost: 650000, totalCost: 3250000, createdAt: d(-90) } });
    await tx.stockMovement.create({ data: { companyId, productId: prod2.id, type: 'IN',         quantity: 10, reason: 'Achat initial',         stockBefore: 0,  stockAfter: 10, unitCost: 240000, totalCost: 2400000, createdAt: d(-90) } });
    await tx.stockMovement.create({ data: { companyId, productId: prod3.id, type: 'IN',         quantity: 50, reason: 'Réapprovisionnement',   stockBefore: 0,  stockAfter: 50, unitCost: 3500,   totalCost: 175000,  createdAt: d(-60) } });
    await tx.stockMovement.create({ data: { companyId, productId: prod4.id, type: 'IN',         quantity: 20, reason: 'Achat initial',         stockBefore: 0,  stockAfter: 20, unitCost: 32000,  totalCost: 640000,  createdAt: d(-45) } });
    await tx.stockMovement.create({ data: { companyId, productId: prod2.id, type: 'OUT',        quantity: 2,  reason: 'Vente client TechCorp', stockBefore: 10, stockAfter: 8,  unitCost: 240000, totalCost: 480000,  createdAt: d(-30) } });
    await tx.stockMovement.create({ data: { companyId, productId: prod4.id, type: 'OUT',        quantity: 5,  reason: 'Vente POS',             stockBefore: 20, stockAfter: 15, unitCost: 32000,  totalCost: 160000,  createdAt: d(-15) } });
    await tx.stockMovement.create({ data: { companyId, productId: prod1.id, type: 'ADJUSTMENT', quantity: 0,  reason: 'Inventaire physique',   stockBefore: 5,  stockAfter: 5,  unitCost: 650000, totalCost: 0,       createdAt: d(-7)  } });
    await tx.stockMovement.create({ data: { companyId, productId: prod5.id, type: 'IN',         quantity: 20, reason: 'Réapprovisionnement',   stockBefore: 0,  stockAfter: 20, unitCost: 12000,  totalCost: 240000,  createdAt: d(-5)  } });

    // Alerte stock épuisé (clavier)
    const kbProd = await tx.inventoryProduct.findFirst({ where: { sku: 'KB-MECH-001', companyId } });
    if (kbProd) {
      const alertExists = await tx.stockAlert.findFirst({ where: { companyId, productId: kbProd.id, isResolved: false } });
      if (!alertExists) await tx.stockAlert.create({ data: { companyId, productId: kbProd.id, type: 'OUT_OF_STOCK', message: 'Stock épuisé pour Clavier mécanique', isResolved: false } });
    }

    // ── 21. POS : Caisse ─────────────────────────────────────────────────────
    const regCode = `SEED-CASH-${companyId.slice(0, 6).toUpperCase()}`;
    const register = await tx.cashRegister.upsert({
      where: { code_companyId: { code: regCode, companyId } },
      update: {},
      create: { companyId, name: 'Caisse principale', code: regCode, location: 'Accueil', isActive: true },
    });

    // ── 22. POS : Sessions (3 fermées + 1 ouverte) ──────────────────────────
    const existingSessions = await tx.cashSession.findMany({ where: { companyId, registerId: register.id } });
    let sess1: any, sess2: any, sess3: any;
    if (existingSessions.length === 0) {
      sess1 = await tx.cashSession.create({ data: { companyId, registerId: register.id, cashierId: emp4.id, openingAmount: 50000, closingAmount: 487600, expectedAmount: 487600, difference: 0,     status: 'CLOSED', openedAt: dt(-60, 8), closedAt: dt(-60, 18) } });
      sess2 = await tx.cashSession.create({ data: { companyId, registerId: register.id, cashierId: emp7.id, openingAmount: 75000, closingAmount: 623200, expectedAmount: 620000, difference: 3200,  status: 'CLOSED', openedAt: dt(-30, 8), closedAt: dt(-30, 18) } });
      sess3 = await tx.cashSession.create({ data: { companyId, registerId: register.id, cashierId: emp4.id, openingAmount: 50000, closingAmount: 312400, expectedAmount: 315000, difference: -2600, status: 'CLOSED', openedAt: dt(-1, 8),  closedAt: dt(-1, 18)  } });
    } else {
      sess1 = existingSessions[0];
      sess2 = existingSessions[1] ?? existingSessions[0];
      sess3 = existingSessions[2] ?? existingSessions[0];
    }
    const existingOpen = await tx.cashSession.findFirst({ where: { companyId, registerId: register.id, status: 'OPEN' } });
    const session = existingOpen ?? await tx.cashSession.create({ data: { companyId, registerId: register.id, cashierId: emp4.id, openingAmount: 50000, status: 'OPEN', openedAt: dt(0, 8) } });

    // ── 23. POS : Ventes ─────────────────────────────────────────────────────
    const saleBase = `SEED-POS-${companyId.slice(0, 6).toUpperCase()}`;
    if (!await tx.sale.findFirst({ where: { companyId, saleNumber: `${saleBase}-001` } })) {
      await tx.sale.create({ data: { companyId, registerId: register.id, sessionId: sess1.id, cashierId: emp4.id, saleNumber: `${saleBase}-001`, subtotal: 320000, taxAmount: 57600,  taxPercent: 18, total: 377600,  paymentMethod: 'CASH',         amountPaid: 400000,  changeAmount: 22400, status: 'COMPLETED', createdAt: dt(-60, 10), items: { create: [{ productId: prod2.id, productName: prod2.name, productSku: prod2.sku ?? '', quantity: 1, unitPrice: 320000, taxPercent: 18, subtotal: 320000, total: 377600  }] } } });
      await tx.sale.create({ data: { companyId, registerId: register.id, sessionId: sess1.id, cashierId: emp4.id, saleNumber: `${saleBase}-002`, subtotal: 45000,  taxAmount: 8100,   taxPercent: 18, total: 53100,   paymentMethod: 'MOBILE_MONEY', amountPaid: 53100,   changeAmount: 0,     status: 'COMPLETED', createdAt: dt(-60, 14), items: { create: [{ productId: prod4.id, productName: prod4.name, productSku: prod4.sku ?? '', quantity: 1, unitPrice: 45000,  taxPercent: 18, subtotal: 45000,  total: 53100   }] } } });
      await tx.sale.create({ data: { companyId, registerId: register.id, sessionId: sess2.id, cashierId: emp7.id, saleNumber: `${saleBase}-003`, subtotal: 5000,   taxAmount: 900,    taxPercent: 18, total: 5900,    paymentMethod: 'CASH',         amountPaid: 6000,    changeAmount: 100,   status: 'COMPLETED', createdAt: dt(-30, 9),  items: { create: [{ productId: prod3.id, productName: prod3.name, productSku: prod3.sku ?? '', quantity: 1, unitPrice: 5000,   taxPercent: 18, subtotal: 5000,   total: 5900    }] } } });
      await tx.sale.create({ data: { companyId, registerId: register.id, sessionId: sess2.id, cashierId: emp7.id, saleNumber: `${saleBase}-004`, subtotal: 850000, taxAmount: 153000, taxPercent: 18, total: 1003000, paymentMethod: 'CARD',         amountPaid: 1003000, changeAmount: 0,     status: 'COMPLETED', createdAt: dt(-30, 11), items: { create: [{ productId: prod1.id, productName: prod1.name, productSku: prod1.sku ?? '', quantity: 1, unitPrice: 850000, taxPercent: 18, subtotal: 850000, total: 1003000 }] } } });
      await tx.sale.create({ data: { companyId, registerId: register.id, sessionId: sess3.id, cashierId: emp4.id, saleNumber: `${saleBase}-005`, subtotal: 18000,  taxAmount: 3240,   taxPercent: 18, total: 21240,   paymentMethod: 'CASH',         amountPaid: 25000,   changeAmount: 3760,  status: 'COMPLETED', createdAt: dt(-1, 10),  items: { create: [{ productId: prod5.id, productName: prod5.name, productSku: prod5.sku ?? '', quantity: 1, unitPrice: 18000,  taxPercent: 18, subtotal: 18000,  total: 21240   }] } } });
      await tx.sale.create({ data: { companyId, registerId: register.id, sessionId: session.id, cashierId: emp4.id, customerId: ct1.id, saleNumber: `${saleBase}-006`, subtotal: 45000, taxAmount: 8100, taxPercent: 18, total: 53100, paymentMethod: 'MOBILE_MONEY', amountPaid: 53100, changeAmount: 0, status: 'COMPLETED', items: { create: [{ productId: prod4.id, productName: prod4.name, productSku: prod4.sku ?? '', quantity: 1, unitPrice: 45000, taxPercent: 18, subtotal: 45000, total: 53100 }] } } });
    }

    // ── 24. Projets ──────────────────────────────────────────────────────────
    const p1Code = `SEED-PROJ-${companyId.slice(0, 6).toUpperCase()}-001`;
    const p2Code = `SEED-PROJ-${companyId.slice(0, 6).toUpperCase()}-002`;
    const p3Code = `SEED-PROJ-${companyId.slice(0, 6).toUpperCase()}-003`;

    let proj1 = await tx.project.findFirst({ where: { companyId, code: p1Code } });
    if (!proj1) proj1 = await tx.project.create({ data: { companyId, createdById: ownerId, clientId: cc1.id, name: 'Refonte site TechCorp',   code: p1Code, status: 'IN_PROGRESS', priority: 'HIGH',   progress: 35,  budget: 2500000, currency: 'XOF', startDate: d(-15), endDate: d(45),  members: { create: [{ employeeId: emp3.id, role: 'MANAGER' }, { employeeId: emp5.id, role: 'MEMBER' }, { employeeId: emp8.id, role: 'MEMBER' }] } } });
    let proj2 = await tx.project.findFirst({ where: { companyId, code: p2Code } });
    if (!proj2) proj2 = await tx.project.create({ data: { companyId, createdById: ownerId, clientId: cc2.id, name: 'Système Agro Solutions', code: p2Code, status: 'PENDING',     priority: 'URGENT', progress: 0,   budget: 5000000, currency: 'XOF', startDate: d(5),   endDate: d(90),  members: { create: [{ employeeId: emp3.id, role: 'OWNER' }, { employeeId: emp7.id, role: 'MEMBER' }] } } });
    let proj3 = await tx.project.findFirst({ where: { companyId, code: p3Code } });
    if (!proj3) proj3 = await tx.project.create({ data: { companyId, createdById: ownerId, clientId: cc3.id, name: 'Audit SI BanqueOuest',   code: p3Code, status: 'COMPLETED',   priority: 'MEDIUM', progress: 100, budget: 3200000, currency: 'XOF', startDate: d(-60), endDate: d(-5),  members: { create: [{ employeeId: emp3.id, role: 'MANAGER' }, { employeeId: emp6.id, role: 'MEMBER' }] } } });

    // ── 25. Projets : Tâches + sous-tâches ──────────────────────────────────
    const existingTasks = await tx.task.findMany({ where: { projectId: proj1.id } });
    let task1: any, task2: any;
    if (existingTasks.length === 0) {
      task1 = await tx.task.create({ data: { companyId, projectId: proj1.id, createdById: ownerId, title: 'Maquettes UI/UX',         status: 'DONE',        priority: 'HIGH',   assigneeId: emp3.id, estimatedHours: 16, actualHours: 14, position: 0, dueDate: d(-10) } });
      task2 = await tx.task.create({ data: { companyId, projectId: proj1.id, createdById: ownerId, title: 'Développement frontend',  status: 'IN_PROGRESS', priority: 'HIGH',   assigneeId: emp3.id, estimatedHours:  40, actualHours: 12, position: 1, dueDate: d(20) } });
      await tx.task.create({ data: { companyId, projectId: proj1.id, createdById: ownerId, title: 'Intégration API backend', status: 'TODO',        priority: 'MEDIUM', assigneeId: emp5.id, estimatedHours: 24, position: 2, dueDate: d(35) } });
      await tx.task.create({ data: { companyId, projectId: proj1.id, createdById: ownerId, title: 'Tests et recette',        status: 'TODO',        priority: 'LOW',    assigneeId: emp8.id, estimatedHours: 8,  position: 3, dueDate: d(42) } });
      // Sous-tâches de task2
      await tx.task.create({ data: { companyId, projectId: proj1.id, createdById: ownerId, parentId: task2.id, title: "Page d'accueil", status: 'IN_PROGRESS', priority: 'HIGH',   assigneeId: emp3.id, estimatedHours: 8, position: 0 } });
      await tx.task.create({ data: { companyId, projectId: proj1.id, createdById: ownerId, parentId: task2.id, title: 'Page contact',   status: 'TODO',        priority: 'MEDIUM', assigneeId: emp5.id, estimatedHours: 4, position: 1 } });
      // Tâches projet 2
      await tx.task.create({ data: { companyId, projectId: proj2.id, createdById: ownerId, title: 'Analyse des besoins',    status: 'TODO', priority: 'URGENT', assigneeId: emp3.id, estimatedHours: 8,  position: 0, dueDate: d(7)  } });
      await tx.task.create({ data: { companyId, projectId: proj2.id, createdById: ownerId, title: 'Architecture technique', status: 'TODO', priority: 'HIGH',   assigneeId: emp3.id, estimatedHours: 16, position: 1, dueDate: d(15) } });
      // Tâches projet 3 (terminé)
      await tx.task.create({ data: { companyId, projectId: proj3.id, createdById: ownerId, title: 'Audit infrastructure', status: 'DONE', priority: 'HIGH', assigneeId: emp3.id, estimatedHours: 24, actualHours: 22, position: 0 } });
      await tx.task.create({ data: { companyId, projectId: proj3.id, createdById: ownerId, title: 'Rapport final',        status: 'DONE', priority: 'HIGH', assigneeId: emp6.id, estimatedHours: 8,  actualHours: 10, position: 1 } });
    } else {
      task1 = existingTasks.find((t) => t.title === 'Maquettes UI/UX')        ?? existingTasks[0];
      task2 = existingTasks.find((t) => t.title === 'Développement frontend') ?? existingTasks[1] ?? existingTasks[0];
    }

    // ── 26. Projets : Commentaires ───────────────────────────────────────────
    if (task1 && task2) {
      const existingComments = await tx.taskComment.findMany({ where: { taskId: task1.id } });
      if (existingComments.length === 0) {
        await tx.taskComment.create({ data: { taskId: task1.id, authorId: ownerId,  content: 'Maquettes validées par le client, on peut passer au dev !',  createdAt: d(-8) } });
        await tx.taskComment.create({ data: { taskId: task1.id, authorId: emp3.id,  content: "J'ai utilisé Figma pour les prototypes interactifs.",          createdAt: d(-7) } });
        await tx.taskComment.create({ data: { taskId: task2.id, authorId: emp3.id,  content: 'Composants de base créés, je commence la page accueil.',       createdAt: d(-2) } });
        await tx.taskComment.create({ data: { taskId: task2.id, authorId: emp5.id,  content: 'Je peux aider sur la partie responsive si besoin.',            createdAt: d(-1) } });
        await tx.taskComment.create({ data: { taskId: task2.id, authorId: ownerId,  content: 'Bon avancement, continuez !',                                  createdAt: d(0)  } });
      }
    }

    // ── 27. Projets : Time entries ───────────────────────────────────────────
    const existingEntries = await tx.timeEntry.findMany({ where: { projectId: proj1.id, employeeId: emp3.id } });
    if (existingEntries.length === 0 && task1 && task2) {
      await tx.timeEntry.create({ data: { companyId, projectId: proj1.id, taskId: task1.id, employeeId: emp3.id, startTime: dt(-12, 9), endTime: dt(-12, 17), duration: 8, description: 'Création maquettes Figma jour 1',    isBillable: true,  hourlyRate: 15000 } });
      await tx.timeEntry.create({ data: { companyId, projectId: proj1.id, taskId: task1.id, employeeId: emp3.id, startTime: dt(-11, 9), endTime: dt(-11, 15), duration: 6, description: 'Finalisation maquettes + export',    isBillable: true,  hourlyRate: 15000 } });
      await tx.timeEntry.create({ data: { companyId, projectId: proj1.id, taskId: task2.id, employeeId: emp3.id, startTime: dt(-5, 9),  endTime: dt(-5, 15),  duration: 6, description: 'Setup React + composants UI',        isBillable: true,  hourlyRate: 15000 } });
      await tx.timeEntry.create({ data: { companyId, projectId: proj1.id, taskId: task2.id, employeeId: emp3.id, startTime: dt(-3, 9),  endTime: dt(-3, 15),  duration: 6, description: 'Développement page accueil',         isBillable: true,  hourlyRate: 15000 } });
      await tx.timeEntry.create({ data: { companyId, projectId: proj1.id, taskId: task2.id, employeeId: emp5.id, startTime: dt(-2, 10), endTime: dt(-2, 14),  duration: 4, description: 'Aide intégration responsive',        isBillable: false, hourlyRate: 10000 } });
      await tx.timeEntry.create({ data: { companyId, projectId: proj3.id, employeeId: emp3.id, startTime: dt(-50, 9), endTime: dt(-50, 17), duration: 8, description: 'Audit infrastructure réseau', isBillable: true, hourlyRate: 15000 } });
    }

    return {
      message: 'Données de test créées avec succès',
      summary: {
        employees: 8,
        departments: 5,
        positions: 8,
        publicHolidays: 8,
        expenses: 5,
        attendanceDays: '~20 jours ouvrés',
        contacts: 8,
        clientCompanies: 5,
        opportunities: 6,
        activities: 8,
        taxRates: 2,
        suppliers: 3,
        quotes: 4,
        invoices: 5,
        bills: 3,
        productCategories: 4,
        products: 8,
        stockMovements: 8,
        cashRegisters: 1,
        cashSessions: 4,
        sales: 6,
        projects: 3,
        tasks: '10+ avec sous-tâches',
        taskComments: 5,
        timeEntries: 6,
      },
    };
  }, { timeout: 60000 });
}

