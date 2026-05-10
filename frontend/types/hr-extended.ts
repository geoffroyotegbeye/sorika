// Types pour les fonctionnalités RH étendues

// ─── Congés & Absences ───────────────────────────────────────────────────────

export interface LeaveType {
  id: string;
  name: string;
  code: string;
  isPaid: boolean;
  requiresApproval: boolean;
  color: string;
  companyId: string;
  createdAt: string;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  leaveType?: LeaveType;
  year: number;
  total: number;
  used: number;
  remaining: number;
  createdAt: string;
  updatedAt: string;
}

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface Leave {
  id: string;
  employeeId: string;
  employee?: {
    firstName: string;
    lastName: string;
  };
  leaveTypeId: string;
  leaveType?: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeaveDto {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
}

export interface UpdateLeaveStatusDto {
  status: 'APPROVED' | 'REJECTED' | 'CANCELLED';
  rejectionReason?: string;
}

// ─── Documents Employés ──────────────────────────────────────────────────────

export type DocumentCategory = 'CONTRACT' | 'IDENTITY' | 'DIPLOMA' | 'CERTIFICATE' | 'OTHER';

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  name: string;
  category: DocumentCategory;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  uploadedBy?: string;
  companyId: string;
  createdAt: string;
}

export interface CreateEmployeeDocumentDto {
  name: string;
  category: DocumentCategory;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
}

// ─── Notes de Frais ──────────────────────────────────────────────────────────

export type ExpenseCategory = 'TRANSPORT' | 'MEAL' | 'ACCOMMODATION' | 'OTHER';
export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REIMBURSED';

export interface Expense {
  id: string;
  employeeId: string;
  employee?: {
    firstName: string;
    lastName: string;
  };
  title: string;
  description?: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  date: string;
  receiptUrl?: string;
  status: ExpenseStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  reimbursedAt?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseDto {
  title: string;
  description?: string;
  amount: number;
  currency?: string;
  category: ExpenseCategory;
  date: string;
  receiptUrl?: string;
}

export interface UpdateExpenseStatusDto {
  status: 'APPROVED' | 'REJECTED' | 'REIMBURSED';
  rejectionReason?: string;
}
