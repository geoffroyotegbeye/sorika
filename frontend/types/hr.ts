export type ContractType = 'CDI' | 'CDD' | 'FREELANCE' | 'STAGE' | 'ALTERNANCE' | 'PRESTATION';
export type PositionLevel = 'EXECUTIVE' | 'MANAGER' | 'STAFF' | 'INTERN';

export interface Position {
  id: string;
  title: string;
  description: string | null;
  level: PositionLevel | null;
  companyId: string;
  createdAt: string;
  _count?: {
    employees: number;
  };
}

export interface Department {
  id: string;
  name: string;
  description: string | null;
  companyId: string;
  createdAt: string;
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
  salary: number | null;
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
