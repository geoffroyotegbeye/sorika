export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'REMOTE';

export interface Attendance {
  id: string;
  employeeId: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    /** Chaîne ou objet Position renvoyé par l’API */
    position?: string | { id: string; title: string } | null;
  };
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
  hoursWorked: number | null;
  notes: string | null;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttendanceDto {
  date: string;
  checkIn?: string;
  checkOut?: string;
  status?: AttendanceStatus;
  notes?: string;
  hoursWorked?: number;
}

export interface UpdateAttendanceDto {
  checkIn?: string;
  checkOut?: string;
  status?: AttendanceStatus;
  notes?: string;
}

export interface HRStats {
  totalEmployees: number;
  activeEmployees: number;
  ongoingLeaves: number;
  pendingLeaves: number;
  pendingExpenses: number;
  attendanceRate: number;
  departments: {
    id: string;
    name: string;
    employeeCount: number;
  }[];
}
