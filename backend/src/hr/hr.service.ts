import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { CreateAdvanceDto } from './dto/create-advance.dto';
import { UpdateAdvanceDto } from './dto/update-advance.dto';
import { CreateAdvanceRuleDto } from './dto/create-advance-rule.dto';
import { CreatePayrollVariableDto } from './dto/create-payroll-variable.dto';
import { CreatePayrollPeriodDto } from './dto/create-payroll-period.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class HRService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Employees ───────────────────────────────────────────────────────────────

  async listEmployees(companyId: string) {
    return this.prisma.employee.findMany({
      where: { companyId },
      include: { 
        department: true,
        position: true,
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: { select: { title: true } },
          },
        },
        _count: {
          select: { subordinates: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createEmployee(companyId: string, dto: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        positionId: dto.positionId,
        hireDate: new Date(dto.hireDate),
        contractType: dto.contractType,
        salary: dto.salary,
        isActive: dto.isActive ?? true,
        departmentId: dto.departmentId,
        managerId: dto.managerId,
        userId: dto.userId,
        companyId,
      },
      include: { 
        department: true,
        position: true,
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async updateEmployee(companyId: string, employeeId: string, dto: UpdateEmployeeDto) {
    const employee = await this.prisma.employee.findFirst({ where: { id: employeeId, companyId } });
    if (!employee) throw new NotFoundException('Employé introuvable');

    // Créer un historique d'affectation si le poste ou département change
    const hasPositionChange = dto.positionId !== undefined && dto.positionId !== employee.positionId;
    const hasDepartmentChange = dto.departmentId !== undefined && dto.departmentId !== employee.departmentId;

    if (hasPositionChange || hasDepartmentChange) {
      await this.prisma.assignment.create({
        data: {
          employeeId,
          fromPositionId: employee.positionId,
          toPositionId: dto.positionId,
          fromDepartmentId: employee.departmentId,
          toDepartmentId: dto.departmentId,
          effectiveDate: new Date(),
          reason: 'Mise à jour manuelle',
          companyId,
        },
      });
    }

    return this.prisma.employee.update({
      where: { id: employeeId },
      data: {
        ...(dto.firstName !== undefined && { firstName: dto.firstName }),
        ...(dto.lastName !== undefined && { lastName: dto.lastName }),
        ...(dto.positionId !== undefined && { positionId: dto.positionId }),
        ...(dto.hireDate !== undefined && { hireDate: new Date(dto.hireDate) }),
        ...(dto.contractType !== undefined && { contractType: dto.contractType }),
        ...(dto.salary !== undefined && { salary: dto.salary }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.departmentId !== undefined && { departmentId: dto.departmentId }),
        ...(dto.managerId !== undefined && { managerId: dto.managerId }),
        ...(dto.userId !== undefined && { userId: dto.userId }),
      },
      include: { 
        department: true,
        position: true,
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async deleteEmployee(companyId: string, employeeId: string) {
    const employee = await this.prisma.employee.findFirst({ where: { id: employeeId, companyId } });
    if (!employee) throw new NotFoundException('Employé introuvable');

    await this.prisma.employee.delete({ where: { id: employeeId } });
  }

  // ─── Import/Export Employés ──────────────────────────────────────────────────

  async exportEmployeesToCSV(companyId: string): Promise<string> {
    const employees = await this.prisma.employee.findMany({
      where: { companyId },
      include: {
        position: true,
        department: true,
        manager: {
          include: {
            user: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // En-têtes CSV
    const headers = [
      'Prénom',
      'Nom',
      'Email',
      'Poste',
      'Département',
      'Manager Email',
      'Date Embauche',
      'Type Contrat',
      'Salaire',
      'Actif',
    ];

    // Lignes de données
    const rows = employees.map((emp) => [
      emp.firstName,
      emp.lastName,
      emp.user?.email || '',
      emp.position?.title || '',
      emp.department?.name || '',
      emp.manager?.user?.email || '',
      emp.hireDate.toISOString().split('T')[0],
      emp.contractType || '',
      emp.salary?.toString() || '',
      emp.isActive ? 'Oui' : 'Non',
    ]);

    // Construire le CSV
    const csvLines = [headers, ...rows];
    return csvLines.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  }

  async importEmployeesFromCSV(companyId: string, csvContent: string) {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      throw new BadRequestException('Le fichier CSV est vide ou invalide');
    }

    // Ignorer la première ligne (en-têtes)
    const dataLines = lines.slice(1);

    const results = {
      success: 0,
      errors: [] as string[],
    };

    // Charger les positions et départements existants
    const positions = await this.prisma.position.findMany({ where: { companyId } });
    const departments = await this.prisma.department.findMany({ where: { companyId } });
    const existingEmployees = await this.prisma.employee.findMany({
      where: { companyId },
      include: { user: true },
    });

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i].trim();
      if (!line) continue;

      try {
        // Parser la ligne CSV (gérer les guillemets)
        const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map((v) => v.replace(/^"|"$/g, '').trim()) || [];

        if (values.length < 2) {
          results.errors.push(`Ligne ${i + 2}: Format invalide`);
          continue;
        }

        const [
          firstName,
          lastName,
          email,
          positionTitle,
          departmentName,
          managerEmail,
          hireDate,
          contractType,
          salaryStr,
          isActiveStr,
        ] = values;

        // Validation des champs requis
        if (!firstName || !lastName) {
          results.errors.push(`Ligne ${i + 2}: Prénom et nom requis`);
          continue;
        }

        // Trouver le poste
        let positionId: string | undefined;
        if (positionTitle) {
          const position = positions.find((p) => p.title.toLowerCase() === positionTitle.toLowerCase());
          positionId = position?.id;
        }

        // Trouver le département
        let departmentId: string | undefined;
        if (departmentName) {
          const department = departments.find((d) => d.name.toLowerCase() === departmentName.toLowerCase());
          departmentId = department?.id;
        }

        // Trouver le manager par email
        let managerId: string | undefined;
        if (managerEmail) {
          const manager = existingEmployees.find((e) => e.user?.email.toLowerCase() === managerEmail.toLowerCase());
          managerId = manager?.id;
        }

        // Parser le salaire
        const salary = salaryStr ? parseFloat(salaryStr) : undefined;

        // Parser isActive
        const isActive = isActiveStr?.toLowerCase() === 'oui' || isActiveStr?.toLowerCase() === 'true' || isActiveStr === '1';

        // Créer l'employé
        await this.prisma.employee.create({
          data: {
            firstName,
            lastName,
            positionId,
            departmentId,
            managerId,
            hireDate: hireDate ? new Date(hireDate) : new Date(),
            contractType: contractType || null,
            salary,
            isActive,
            companyId,
          },
        });

        results.success++;
      } catch (err: any) {
        results.errors.push(`Ligne ${i + 2}: ${err.message}`);
      }
    }

    return results;
  }

  async linkEmployeeToUser(companyId: string, employeeId: string, userId: string) {
    const employee = await this.prisma.employee.findFirst({ where: { id: employeeId, companyId } });
    if (!employee) throw new NotFoundException('Employé introuvable');

    // Vérifier que le User est membre de la Company
    const membership = await this.prisma.membership.findUnique({
      where: { userId_companyId: { userId, companyId } },
    });
    if (!membership) {
      throw new ForbiddenException("Cet utilisateur n'est pas membre de l'organisation");
    }

    // Vérifier qu'aucun autre Employee dans la Company n'est déjà lié à ce userId
    const existingLink = await this.prisma.employee.findFirst({
      where: { companyId, userId, id: { not: employeeId } },
    });
    if (existingLink) {
      throw new ConflictException('Cet utilisateur est déjà lié à un autre employé dans cette organisation');
    }

    return this.prisma.employee.update({
      where: { id: employeeId },
      data: { userId },
      include: { department: true },
    });
  }

  // ─── Departments ─────────────────────────────────────────────────────────────

  async listDepartments(companyId: string) {
    return this.prisma.department.findMany({
      where: { companyId },
      include: { _count: { select: { employees: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createDepartment(companyId: string, dto: CreateDepartmentDto) {
    try {
      return await this.prisma.department.create({
        data: {
          name: dto.name,
          description: dto.description,
          companyId,
        },
        include: { _count: { select: { employees: true } } },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`Un département avec le nom "${dto.name}" existe déjà dans cette organisation`);
      }
      throw error;
    }
  }

  async updateDepartment(companyId: string, departmentId: string, dto: UpdateDepartmentDto) {
    const department = await this.prisma.department.findFirst({ where: { id: departmentId, companyId } });
    if (!department) throw new NotFoundException('Département introuvable');

    try {
      return await this.prisma.department.update({
        where: { id: departmentId },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.description !== undefined && { description: dto.description }),
        },
        include: { _count: { select: { employees: true } } },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`Un département avec le nom "${dto.name}" existe déjà dans cette organisation`);
      }
      throw error;
    }
  }

  async deleteDepartment(companyId: string, departmentId: string) {
    const department = await this.prisma.department.findFirst({
      where: { id: departmentId, companyId },
      include: { _count: { select: { employees: true } } },
    });
    if (!department) throw new NotFoundException('Département introuvable');

    if (department._count.employees > 0) {
      throw new BadRequestException(
        `Impossible de supprimer ce département : il contient ${department._count.employees} employé(s). Veuillez d'abord réaffecter ou supprimer ces employés.`,
      );
    }

    await this.prisma.department.delete({ where: { id: departmentId } });
  }

  // ─── Postes/Fonctions ────────────────────────────────────────────────────────

  async listPositions(companyId: string) {
    return this.prisma.position.findMany({
      where: { companyId },
      include: { _count: { select: { employees: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createPosition(companyId: string, dto: any) {
    try {
      return await this.prisma.position.create({
        data: {
          title: dto.title,
          description: dto.description,
          level: dto.level,
          companyId,
        },
        include: { _count: { select: { employees: true } } },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`Un poste avec le titre "${dto.title}" existe déjà dans cette organisation`);
      }
      throw error;
    }
  }

  async updatePosition(companyId: string, positionId: string, dto: any) {
    const position = await this.prisma.position.findFirst({ where: { id: positionId, companyId } });
    if (!position) throw new NotFoundException('Poste introuvable');

    try {
      return await this.prisma.position.update({
        where: { id: positionId },
        data: {
          ...(dto.title !== undefined && { title: dto.title }),
          ...(dto.description !== undefined && { description: dto.description }),
          ...(dto.level !== undefined && { level: dto.level }),
        },
        include: { _count: { select: { employees: true } } },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`Un poste avec le titre "${dto.title}" existe déjà dans cette organisation`);
      }
      throw error;
    }
  }

  async deletePosition(companyId: string, positionId: string) {
    const position = await this.prisma.position.findFirst({
      where: { id: positionId, companyId },
      include: { _count: { select: { employees: true } } },
    });
    if (!position) throw new NotFoundException('Poste introuvable');

    if (position._count.employees > 0) {
      throw new BadRequestException(
        `Impossible de supprimer ce poste : il est assigné à ${position._count.employees} employé(s). Veuillez d'abord réaffecter ces employés.`,
      );
    }

    await this.prisma.position.delete({ where: { id: positionId } });
  }

  // ─── Affectations (Historique) ──────────────────────────────────────────────

  async listAssignments(companyId: string, employeeId?: string) {
    return this.prisma.assignment.findMany({
      where: {
        companyId,
        ...(employeeId && { employeeId }),
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { effectiveDate: 'desc' },
    });
  }

  async createAssignment(companyId: string, employeeId: string, dto: any, createdBy: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });
    if (!employee) throw new NotFoundException('Employé introuvable');

    // Créer l'affectation
    const assignment = await this.prisma.assignment.create({
      data: {
        employeeId,
        fromPositionId: dto.fromPositionId,
        toPositionId: dto.toPositionId,
        fromDepartmentId: dto.fromDepartmentId,
        toDepartmentId: dto.toDepartmentId,
        reason: dto.reason,
        effectiveDate: new Date(dto.effectiveDate),
        notes: dto.notes,
        createdBy,
        companyId,
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Mettre à jour l'employé si l'affectation est effective aujourd'hui ou dans le passé
    const now = new Date();
    const effectiveDate = new Date(dto.effectiveDate);
    
    if (effectiveDate <= now) {
      await this.prisma.employee.update({
        where: { id: employeeId },
        data: {
          ...(dto.toPositionId && { positionId: dto.toPositionId }),
          ...(dto.toDepartmentId && { departmentId: dto.toDepartmentId }),
        },
      });
    }

    return assignment;
  }

  async deleteAssignment(companyId: string, assignmentId: string) {
    const assignment = await this.prisma.assignment.findFirst({
      where: { id: assignmentId, companyId },
    });
    if (!assignment) throw new NotFoundException('Affectation introuvable');

    await this.prisma.assignment.delete({ where: { id: assignmentId } });
  }

  // ─── Congés & Absences ───────────────────────────────────────────────────────

  async listLeaveTypes(companyId: string) {
    return this.prisma.leaveType.findMany({
      where: { companyId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createLeaveType(companyId: string, dto: any) {
    return this.prisma.leaveType.create({
      data: {
        name: dto.name,
        code: dto.code,
        isPaid: dto.isPaid ?? true,
        requiresApproval: dto.requiresApproval ?? true,
        color: dto.color ?? '#3b82f6',
        companyId,
      },
    });
  }

  async initializeDefaultLeaveTypes(companyId: string) {
    // Vérifier si des types existent déjà
    const existing = await this.prisma.leaveType.findFirst({ where: { companyId } });
    if (existing) return;

    // Créer les types par défaut
    const defaultTypes = [
      { name: 'Congé Payé', code: 'CP', isPaid: true, requiresApproval: true, color: '#3b82f6' },
      { name: 'RTT', code: 'RTT', isPaid: true, requiresApproval: true, color: '#8b5cf6' },
      { name: 'Maladie', code: 'SICK', isPaid: true, requiresApproval: false, color: '#ef4444' },
      { name: 'Sans Solde', code: 'UNPAID', isPaid: false, requiresApproval: true, color: '#64748b' },
      { name: 'Autre', code: 'OTHER', isPaid: false, requiresApproval: true, color: '#f59e0b' },
    ];

    await this.prisma.leaveType.createMany({
      data: defaultTypes.map((type) => ({ ...type, companyId })),
    });
  }

  async deleteLeaveType(companyId: string, leaveTypeId: string) {
    const leaveType = await this.prisma.leaveType.findFirst({
      where: { id: leaveTypeId, companyId },
    });
    if (!leaveType) throw new NotFoundException('Type de congé introuvable');

    await this.prisma.leaveType.delete({ where: { id: leaveTypeId } });
  }

  async listLeaves(companyId: string, employeeId?: string) {
    return this.prisma.leave.findMany({
      where: {
        companyId,
        ...(employeeId && { employeeId }),
      },
      include: {
        employee: { select: { firstName: true, lastName: true } },
        leaveType: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createLeave(companyId: string, employeeId: string, dto: any) {
    // Vérifier que l'employé appartient à la company
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });
    if (!employee) throw new NotFoundException('Employé introuvable');

    // Vérifier le solde de congés
    const year = new Date(dto.startDate).getFullYear();
    const balance = await this.prisma.leaveBalance.findUnique({
      where: {
        employeeId_leaveTypeId_year: {
          employeeId,
          leaveTypeId: dto.leaveTypeId,
          year,
        },
      },
    });

    if (balance && balance.remaining < dto.days) {
      throw new BadRequestException(
        `Solde insuffisant. Disponible: ${balance.remaining} jours, Demandé: ${dto.days} jours`,
      );
    }

    return this.prisma.leave.create({
      data: {
        employeeId,
        leaveTypeId: dto.leaveTypeId,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        days: dto.days,
        reason: dto.reason,
        companyId,
      },
      include: {
        employee: { select: { firstName: true, lastName: true } },
        leaveType: true,
      },
    });
  }

  async updateLeaveStatus(companyId: string, leaveId: string, dto: any, approverId: string) {
    const leave = await this.prisma.leave.findFirst({
      where: { id: leaveId, companyId },
      include: { leaveType: true },
    });
    if (!leave) throw new NotFoundException('Demande de congé introuvable');

    if (leave.status !== 'PENDING') {
      throw new BadRequestException('Cette demande a déjà été traitée');
    }

    const updatedLeave = await this.prisma.leave.update({
      where: { id: leaveId },
      data: {
        status: dto.status,
        approvedBy: approverId,
        approvedAt: new Date(),
        rejectionReason: dto.rejectionReason,
      },
      include: {
        employee: { select: { firstName: true, lastName: true } },
        leaveType: true,
      },
    });

    // Si approuvé, déduire du solde
    if (dto.status === 'APPROVED') {
      const year = new Date(leave.startDate).getFullYear();
      await this.prisma.leaveBalance.update({
        where: {
          employeeId_leaveTypeId_year: {
            employeeId: leave.employeeId,
            leaveTypeId: leave.leaveTypeId,
            year,
          },
        },
        data: {
          used: { increment: leave.days },
          remaining: { decrement: leave.days },
        },
      });
    }

    return updatedLeave;
  }

  async deleteLeave(companyId: string, leaveId: string) {
    const leave = await this.prisma.leave.findFirst({
      where: { id: leaveId, companyId },
    });
    if (!leave) throw new NotFoundException('Demande de congé introuvable');

    if (leave.status === 'APPROVED') {
      throw new BadRequestException('Impossible de supprimer une demande approuvée');
    }

    await this.prisma.leave.delete({ where: { id: leaveId } });
  }

  // ─── Documents Employés ──────────────────────────────────────────────────────

  async listEmployeeDocuments(companyId: string, employeeId: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });
    if (!employee) throw new NotFoundException('Employé introuvable');

    return this.prisma.employeeDocument.findMany({
      where: { employeeId, companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createEmployeeDocument(companyId: string, employeeId: string, dto: any, uploadedBy: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });
    if (!employee) throw new NotFoundException('Employé introuvable');

    return this.prisma.employeeDocument.create({
      data: {
        employeeId,
        name: dto.name,
        category: dto.category,
        fileUrl: dto.fileUrl,
        fileSize: dto.fileSize,
        mimeType: dto.mimeType,
        uploadedBy,
        companyId,
      },
    });
  }

  async deleteEmployeeDocument(companyId: string, documentId: string) {
    const document = await this.prisma.employeeDocument.findFirst({
      where: { id: documentId, companyId },
    });
    if (!document) throw new NotFoundException('Document introuvable');

    await this.prisma.employeeDocument.delete({ where: { id: documentId } });
  }

  // ─── Notes de Frais ──────────────────────────────────────────────────────────

  async listExpenses(companyId: string, employeeId?: string) {
    return this.prisma.expense.findMany({
      where: {
        companyId,
        ...(employeeId && { employeeId }),
      },
      include: {
        employee: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createExpense(companyId: string, employeeId: string, dto: any) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });
    if (!employee) throw new NotFoundException('Employé introuvable');

    return this.prisma.expense.create({
      data: {
        employeeId,
        title: dto.title,
        description: dto.description,
        amount: dto.amount,
        currency: dto.currency ?? 'XOF',
        category: dto.category,
        date: new Date(dto.date),
        receiptUrl: dto.receiptUrl,
        companyId,
      },
      include: {
        employee: { select: { firstName: true, lastName: true } },
      },
    });
  }

  async updateExpenseStatus(companyId: string, expenseId: string, dto: any, approverId: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id: expenseId, companyId },
    });
    if (!expense) throw new NotFoundException('Note de frais introuvable');

    if (expense.status !== 'PENDING' && dto.status !== 'REIMBURSED') {
      throw new BadRequestException('Cette note de frais a déjà été traitée');
    }

    return this.prisma.expense.update({
      where: { id: expenseId },
      data: {
        status: dto.status,
        approvedBy: approverId,
        approvedAt: dto.status === 'APPROVED' ? new Date() : expense.approvedAt,
        rejectionReason: dto.rejectionReason,
        reimbursedAt: dto.status === 'REIMBURSED' ? new Date() : null,
      },
      include: {
        employee: { select: { firstName: true, lastName: true } },
      },
    });
  }

  async deleteExpense(companyId: string, expenseId: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id: expenseId, companyId },
    });
    if (!expense) throw new NotFoundException('Note de frais introuvable');

    if (expense.status === 'REIMBURSED') {
      throw new BadRequestException('Impossible de supprimer une note de frais remboursée');
    }

    await this.prisma.expense.delete({ where: { id: expenseId } });
  }

  // ─── Attendance (Présences) ──────────────────────────────────────────────────

  async listAttendances(companyId: string, startDate?: string, endDate?: string, employeeId?: string) {
    const where: any = { companyId };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (employeeId) {
      where.employeeId = employeeId;
    }

    return this.prisma.attendance.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: { select: { id: true, title: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async createAttendance(companyId: string, employeeId: string, dto: any) {
    // Vérifier que l'employé existe
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });

    if (!employee) {
      throw new NotFoundException('Employé introuvable');
    }

    // Vérifier qu'il n'y a pas déjà un pointage pour cette date
    const existing = await this.prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: new Date(dto.date),
        },
      },
    });

    if (existing) {
      throw new ConflictException('Un pointage existe déjà pour cette date');
    }

    // Calculer les heures travaillées si checkIn et checkOut sont fournis
    let hoursWorked: number | undefined = dto.hoursWorked;
    if (dto.checkIn && dto.checkOut) {
      const checkIn = new Date(dto.checkIn);
      const checkOut = new Date(dto.checkOut);
      const diffMs = checkOut.getTime() - checkIn.getTime();
      hoursWorked = diffMs / (1000 * 60 * 60); // Convertir en heures
    }

    return this.prisma.attendance.create({
      data: {
        employeeId,
        companyId,
        date: new Date(dto.date),
        checkIn: dto.checkIn ? new Date(dto.checkIn) : null,
        checkOut: dto.checkOut ? new Date(dto.checkOut) : null,
        status: dto.status || 'PRESENT',
        hoursWorked,
        notes: dto.notes,
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: { select: { id: true, title: true } },
          },
        },
      },
    });
  }

  async updateAttendance(companyId: string, attendanceId: string, dto: any) {
    const attendance = await this.prisma.attendance.findFirst({
      where: { id: attendanceId, companyId },
    });

    if (!attendance) {
      throw new NotFoundException('Pointage introuvable');
    }

    // Recalculer les heures travaillées si nécessaire
    let hoursWorked = attendance.hoursWorked;
    const checkIn = dto.checkIn ? new Date(dto.checkIn) : attendance.checkIn;
    const checkOut = dto.checkOut ? new Date(dto.checkOut) : attendance.checkOut;

    if (checkIn && checkOut) {
      const diffMs = checkOut.getTime() - checkIn.getTime();
      hoursWorked = diffMs / (1000 * 60 * 60);
    }

    return this.prisma.attendance.update({
      where: { id: attendanceId },
      data: {
        ...(dto.checkIn && { checkIn: new Date(dto.checkIn) }),
        ...(dto.checkOut && { checkOut: new Date(dto.checkOut) }),
        ...(dto.status && { status: dto.status }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        hoursWorked,
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: { select: { id: true, title: true } },
          },
        },
      },
    });
  }

  async deleteAttendance(companyId: string, attendanceId: string) {
    const attendance = await this.prisma.attendance.findFirst({
      where: { id: attendanceId, companyId },
    });

    if (!attendance) {
      throw new NotFoundException('Pointage introuvable');
    }

    return this.prisma.attendance.delete({
      where: { id: attendanceId },
    });
  }

  // Pointage rapide (check-in ou check-out)
  async quickCheckIn(companyId: string, employeeId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Chercher un pointage existant pour aujourd'hui
    let attendance = await this.prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
    });

    const now = new Date();

    if (!attendance) {
      // Créer un nouveau pointage avec check-in
      attendance = await this.prisma.attendance.create({
        data: {
          employeeId,
          companyId,
          date: today,
          checkIn: now,
          status: 'PRESENT',
        },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              position: { select: { id: true, title: true } },
            },
          },
        },
      });
    } else if (!attendance.checkOut) {
      // Ajouter le check-out et calculer les heures
      const diffMs = now.getTime() - attendance.checkIn!.getTime();
      const hoursWorked = diffMs / (1000 * 60 * 60);

      attendance = await this.prisma.attendance.update({
        where: { id: attendance.id },
        data: {
          checkOut: now,
          hoursWorked,
        },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              position: { select: { id: true, title: true } },
            },
          },
        },
      });
    }

    return attendance;
  }

  // Statistiques RH pour le tableau de bord
  async getHRStats(companyId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Effectif total
    const totalEmployees = await this.prisma.employee.count({
      where: { companyId, isActive: true },
    });

    // Employés actifs
    const activeEmployees = await this.prisma.employee.count({
      where: { companyId, isActive: true },
    });

    // Congés en cours
    const ongoingLeaves = await this.prisma.leave.count({
      where: {
        companyId,
        status: 'APPROVED',
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    // Congés en attente
    const pendingLeaves = await this.prisma.leave.count({
      where: {
        companyId,
        status: 'PENDING',
      },
    });

    // Notes de frais en attente
    const pendingExpenses = await this.prisma.expense.count({
      where: {
        companyId,
        status: 'PENDING',
      },
    });

    // Taux de présence du mois
    const attendances = await this.prisma.attendance.findMany({
      where: {
        companyId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const presentCount = attendances.filter((a) => a.status === 'PRESENT' || a.status === 'REMOTE').length;
    const attendanceRate = attendances.length > 0 ? (presentCount / attendances.length) * 100 : 0;

    // Départements
    const departments = await this.prisma.department.findMany({
      where: { companyId },
      include: {
        _count: {
          select: { employees: true },
        },
      },
    });

    return {
      totalEmployees,
      activeEmployees,
      ongoingLeaves,
      pendingLeaves,
      pendingExpenses,
      attendanceRate: Math.round(attendanceRate),
      departments: departments.map((d) => ({
        id: d.id,
        name: d.name,
        employeeCount: d._count.employees,
      })),
    };
  }

  // ─── Acomptes (Advances) ───────────────────────────────────────────────────────

  async listAdvances(companyId: string) {
    return this.prisma.advance.findMany({
      where: { companyId },
      include: {
        employee: {
          include: {
            department: true,
            position: true,
          },
        },
        advanceRule: true,
      },
      orderBy: { requestDate: 'desc' },
    });
  }

  async createAdvance(companyId: string, dto: CreateAdvanceDto) {
    // Vérifier l'employé
    const employee = await this.prisma.employee.findFirst({
      where: { id: dto.employeeId, companyId },
    });
    if (!employee) {
      throw new NotFoundException('Employé non trouvé');
    }

    // Vérifier la règle d'acompte si fournie
    if (dto.advanceRuleId) {
      const rule = await this.prisma.advanceRule.findFirst({
        where: { id: dto.advanceRuleId, companyId },
      });
      if (!rule) {
        throw new NotFoundException('Règle d\'acompte non trouvée');
      }

      // Vérifier le pourcentage maximum
      if (employee.salary) {
        const maxAmount = (employee.salary * rule.maxPercentage) / 100;
        if (dto.amount > maxAmount) {
          throw new BadRequestException(`Le montant ne peut pas dépasser ${maxAmount} FCFA (${rule.maxPercentage}% du salaire)`);
        }
      }

      // Vérifier le jour du mois
      const currentDay = new Date().getDate();
      if (!rule.allowedDaysOfMonth.includes(currentDay)) {
        throw new BadRequestException(`Les acomptes ne sont autorisés que les jours: ${rule.allowedDaysOfMonth.join(', ')}`);
      }
    }

    return this.prisma.advance.create({
      data: {
        ...dto,
        companyId,
        status: 'PENDING',
      },
      include: {
        employee: {
          include: {
            department: true,
            position: true,
          },
        },
        advanceRule: true,
      },
    });
  }

  async updateAdvance(companyId: string, advanceId: string, dto: UpdateAdvanceDto) {
    const advance = await this.prisma.advance.findFirst({
      where: { id: advanceId, companyId },
    });
    if (!advance) {
      throw new NotFoundException('Acompte non trouvé');
    }

    if (dto.status === 'APPROVED' && dto.approvedBy) {
      dto.approvedAt = new Date();
    }

    if (dto.status === 'REJECTED' && dto.rejectedBy) {
      dto.rejectedAt = new Date();
    }

    if (dto.status === 'PAID') {
      dto.paidAt = new Date();
    }

    return this.prisma.advance.update({
      where: { id: advanceId },
      data: dto,
      include: {
        employee: {
          include: {
            department: true,
            position: true,
          },
        },
        advanceRule: true,
      },
    });
  }

  async deleteAdvance(companyId: string, advanceId: string) {
    const advance = await this.prisma.advance.findFirst({
      where: { id: advanceId, companyId },
    });
    if (!advance) {
      throw new NotFoundException('Acompte non trouvé');
    }

    if (advance.status !== 'PENDING') {
      throw new BadRequestException('Seuls les acomptes en attente peuvent être supprimés');
    }

    return this.prisma.advance.delete({
      where: { id: advanceId },
    });
  }

  async listAdvanceRules(companyId: string) {
    return this.prisma.advanceRule.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAdvanceRule(companyId: string, dto: CreateAdvanceRuleDto) {
    return this.prisma.advanceRule.create({
      data: {
        ...dto,
        companyId,
      },
    });
  }

  async updateAdvanceRule(companyId: string, ruleId: string, dto: Partial<CreateAdvanceRuleDto>) {
    const rule = await this.prisma.advanceRule.findFirst({
      where: { id: ruleId, companyId },
    });
    if (!rule) {
      throw new NotFoundException('Règle d\'acompte non trouvée');
    }

    return this.prisma.advanceRule.update({
      where: { id: ruleId },
      data: dto,
    });
  }

  async deleteAdvanceRule(companyId: string, ruleId: string) {
    const rule = await this.prisma.advanceRule.findFirst({
      where: { id: ruleId, companyId },
    });
    if (!rule) {
      throw new NotFoundException('Règle d\'acompte non trouvée');
    }

    return this.prisma.advanceRule.delete({
      where: { id: ruleId },
    });
  }

  // ─── Paie (Payroll) ─────────────────────────────────────────────────────────────

  async listPayrollPeriods(companyId: string) {
    return this.prisma.payrollPeriod.findMany({
      where: { companyId },
      include: {
        _count: {
          select: { payrollEntries: true },
        },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async createPayrollPeriod(companyId: string, dto: CreatePayrollPeriodDto) {
    return this.prisma.payrollPeriod.create({
      data: {
        ...dto,
        companyId,
      },
    });
  }

  async updatePayrollPeriod(companyId: string, periodId: string, dto: Partial<CreatePayrollPeriodDto>) {
    const period = await this.prisma.payrollPeriod.findFirst({
      where: { id: periodId, companyId },
    });
    if (!period) {
      throw new NotFoundException('Période de paie non trouvée');
    }

    return this.prisma.payrollPeriod.update({
      where: { id: periodId },
      data: dto,
    });
  }

  async deletePayrollPeriod(companyId: string, periodId: string) {
    const period = await this.prisma.payrollPeriod.findFirst({
      where: { id: periodId, companyId },
    });
    if (!period) {
      throw new NotFoundException('Période de paie non trouvée');
    }

    if (period.status !== 'DRAFT') {
      throw new BadRequestException('Seules les périodes en brouillon peuvent être supprimées');
    }

    return this.prisma.payrollPeriod.delete({
      where: { id: periodId },
    });
  }

  async listPayrollVariables(companyId: string) {
    return this.prisma.payrollVariable.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPayrollVariable(companyId: string, dto: CreatePayrollVariableDto) {
    // Vérifier l'unicité du code
    const existing = await this.prisma.payrollVariable.findFirst({
      where: { companyId, code: dto.code },
    });
    if (existing) {
      throw new ConflictException('Ce code existe déjà');
    }

    return this.prisma.payrollVariable.create({
      data: {
        ...dto,
        companyId,
      },
    });
  }

  async updatePayrollVariable(companyId: string, variableId: string, dto: Partial<CreatePayrollVariableDto>) {
    const variable = await this.prisma.payrollVariable.findFirst({
      where: { id: variableId, companyId },
    });
    if (!variable) {
      throw new NotFoundException('Variable de paie non trouvée');
    }

    // Vérifier l'unicité du code si modifié
    if (dto.code && dto.code !== variable.code) {
      const existing = await this.prisma.payrollVariable.findFirst({
        where: { companyId, code: dto.code },
      });
      if (existing) {
        throw new ConflictException('Ce code existe déjà');
      }
    }

    return this.prisma.payrollVariable.update({
      where: { id: variableId },
      data: dto,
    });
  }

  async deletePayrollVariable(companyId: string, variableId: string) {
    const variable = await this.prisma.payrollVariable.findFirst({
      where: { id: variableId, companyId },
    });
    if (!variable) {
      throw new NotFoundException('Variable de paie non trouvée');
    }

    return this.prisma.payrollVariable.delete({
      where: { id: variableId },
    });
  }

  async calculatePayroll(companyId: string, periodId: string) {
    const period = await this.prisma.payrollPeriod.findFirst({
      where: { id: periodId, companyId },
      include: {
        company: true,
      },
    });
    if (!period) {
      throw new NotFoundException('Période de paie non trouvée');
    }

    // Récupérer tous les employés actifs
    const employees = await this.prisma.employee.findMany({
      where: { companyId, isActive: true },
      include: {
        department: true,
        position: true,
      },
    });

    // Récupérer les variables de paie
    const variables = await this.prisma.payrollVariable.findMany({
      where: { companyId },
    });

    // Pour chaque employé, créer une entrée de paie
    const entries: any[] = [];
    for (const employee of employees) {
      if (!employee.salary) continue;

      // Calculer le salaire brut avec les variables
      let grossSalary = employee.salary;
      const variablesMap: Record<string, number> = {};

      for (const variable of variables) {
        if (variable.type === 'FIXED') {
          grossSalary += variable.value || 0;
          variablesMap[variable.code] = variable.value || 0;
        } else if (variable.type === 'PERCENTAGE') {
          const variableValue = (employee.salary * (variable.value || 0)) / 100;
          grossSalary += variableValue;
          variablesMap[variable.code] = variableValue;
        }
      }

      const entry = await this.prisma.payrollEntry.create({
        data: {
          employeeId: employee.id,
          payrollPeriodId: periodId,
          companyId,
          baseSalary: employee.salary,
          grossSalary,
          deductions: 0,
          netSalary: grossSalary,
          variables: variablesMap,
        },
      });
      entries.push(entry);
    }

    // Mettre à jour le statut de la période
    await this.prisma.payrollPeriod.update({
      where: { id: periodId },
      data: { status: 'CALCULATED' },
    });

    return entries;
  }

  async validatePayroll(companyId: string, periodId: string) {
    const period = await this.prisma.payrollPeriod.findFirst({
      where: { id: periodId, companyId },
    });
    if (!period) {
      throw new NotFoundException('Période de paie non trouvée');
    }

    if (period.status !== 'CALCULATED') {
      throw new BadRequestException('La paie doit être calculée avant validation');
    }

    return this.prisma.payrollPeriod.update({
      where: { id: periodId },
      data: { status: 'VALIDATED' },
    });
  }

  async listPayrollEntries(companyId: string, periodId?: string) {
    const where: Prisma.PayrollEntryWhereInput = { companyId };
    if (periodId) {
      where.payrollPeriodId = periodId;
    }

    return this.prisma.payrollEntry.findMany({
      where,
      include: {
        employee: {
          include: {
            department: true,
            position: true,
          },
        },
        payrollPeriod: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
