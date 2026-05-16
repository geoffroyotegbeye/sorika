export type ContractType = 'CDI' | 'CDD' | 'FREELANCE' | 'STAGE' | 'ALTERNANCE' | 'PRESTATION';
export type PositionLevel = 'EXECUTIVE' | 'MANAGER' | 'STAFF' | 'INTERN';

export interface Position {
  id: string;
  title: string;
  description: string | null;
  level: PositionLevel | null;
  baseSalary: number | null;
  companyId: string;
  createdById: string | null;
  updatedById: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    employees: number;
  };
}

export interface Department {
  id: string;
  name: string;
  description: string | null;
  companyId: string;
  createdById: string | null;
  updatedById: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    employees: number;
  };
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  positionId: string | null;
  position?: Position | null;
  contractType: ContractType | null;
  baseSalary: number | null;
  hireDate: string;
  isActive: boolean;
  departmentId: string | null;
  department?: Department | null;
  managerId: string | null;
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
    position?: { title: string } | null;
  } | null;
  _count?: {
    subordinates: number;
  };
  companyId: string;
  userId: string | null;
  createdById: string | null;
  updatedById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  positionId?: string;
  hireDate: string;
  isActive?: boolean;
  departmentId?: string;
  contractType?: ContractType;
  salary?: number;
  managerId?: string;
  userId?: string;
}

export interface UpdateEmployeeDto {
  firstName?: string;
  lastName?: string;
  positionId?: string;
  hireDate?: string;
  isActive?: boolean;
  departmentId?: string;
  contractType?: ContractType;
  salary?: number;
  managerId?: string;
  userId?: string;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
}

export interface UpdateDepartmentDto {
  name?: string;
  description?: string;
}

export interface CreatePositionDto {
  title: string;
  description?: string;
  level?: PositionLevel;
}

export interface UpdatePositionDto {
  title?: string;
  description?: string;
  level?: PositionLevel;
}

// Affectations (Historique des changements de poste/département)
export interface Assignment {
  id: string;
  employeeId: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  fromPositionId: string | null;
  toPositionId: string | null;
  fromDepartmentId: string | null;
  toDepartmentId: string | null;
  reason: string | null;
  effectiveDate: string;
  notes: string | null;
  createdBy: string | null;
  companyId: string;
  createdAt: string;
}

export interface CreateAssignmentDto {
  fromPositionId?: string;
  toPositionId?: string;
  fromDepartmentId?: string;
  toDepartmentId?: string;
  reason?: string;
  effectiveDate: string;
  notes?: string;
}

// Acomptes
export type AdvanceStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface AdvanceRule {
  id: string;
  name: string;
  description: string | null;
  baseSalary: number | null;
  maxPercentage: number; // Pourcentage max du salaire mensuel
  minDaysWorked: number; // Nombre minimum de jours travaillés requis
  allowedDaysOfMonth: number[]; // Jours du mois où les acomptes sont autorisés (1-31)
  requireManagerApproval: boolean;
  companyId: string;
  createdAt: string;
}

export interface Advance {
  id: string;
  employeeId: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    baseSalary: number | null;
  };
  amount: number;
  status: AdvanceStatus;
  requestDate: string;
  approvedDate: string | null;
  paidDate: string | null;
  approvedBy: string | null;
  reason: string;
  companyId: string;
  createdById: string | null;
  updatedById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdvanceDto {
  employeeId: string;
  amount: number;
  reason: string;
}

export interface UpdateAdvanceDto {
  status?: AdvanceStatus;
}

export interface CreateAdvanceRuleDto {
  name: string;
  description?: string;
  baseSalary?: number;
  maxPercentage: number;
  minDaysWorked: number;
  allowedDaysOfMonth: number[];
  requireManagerApproval: boolean;
}

export interface UpdateAdvanceRuleDto {
  name?: string;
  description?: string;
  baseSalary?: number;
  maxPercentage?: number;
  minDaysWorked?: number;
  allowedDaysOfMonth?: number[];
  requireManagerApproval?: boolean;
}

// Paie
export type PayrollStatus = 'DRAFT' | 'CALCULATED' | 'VALIDATED' | 'PAID';

export interface PayrollVariable {
  id: string;
  name: string;
  code: string; // Code unique pour la variable (ex: BASE_SALARY, OVERTIME_RATE)
  type: 'FIXED' | 'PERCENTAGE' | 'FORMULA';
  value: number | null; // Valeur fixe ou pourcentage
  formula: string | null; // Formule si type = FORMULA
  description: string | null;
  appliesTo: 'ALL' | 'POSITION' | 'DEPARTMENT';
  positionId?: string | null;
  departmentId?: string | null;
  companyId: string;
  createdAt: string;
}

export interface PayrollPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  paymentDate: string;
  status: PayrollStatus;
  companyId: string;
  createdAt: string;
}

export interface PayrollEntry {
  id: string;
  payrollPeriodId: string;
  employeeId: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    baseSalary: number | null;
    position?: { title: string } | null;
  };
  baseSalary: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  overtime: number;
  bonuses: number;
  otherDeductions: number;
  status: PayrollStatus;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayrollVariableDto {
  name: string;
  code: string;
  type: 'FIXED' | 'PERCENTAGE' | 'FORMULA';
  value?: number;
  formula?: string;
  description?: string;
  appliesTo: 'ALL' | 'POSITION' | 'DEPARTMENT';
  positionId?: string;
  departmentId?: string;
}

export interface UpdatePayrollVariableDto {
  name?: string;
  code?: string;
  type?: 'FIXED' | 'PERCENTAGE' | 'FORMULA';
  value?: number;
  formula?: string;
  description?: string;
  appliesTo?: 'ALL' | 'POSITION' | 'DEPARTMENT';
  positionId?: string;
  departmentId?: string;
}

export interface CreatePayrollPeriodDto {
  name: string;
  startDate: string;
  endDate: string;
  paymentDate: string;
}

export interface UpdatePayrollPeriodDto {
  name?: string;
  startDate?: string;
  endDate?: string;
  paymentDate?: string;
  status?: PayrollStatus;
}
