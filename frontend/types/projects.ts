export interface Project {
  id: string;
  name: string;
  description?: string;
  code?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startDate?: string;
  endDate?: string;
  completedAt?: string;
  budget?: number;
  currency: string;
  actualCost: number;
  progress: number;
  clientId?: string;
  client?: {
    id: string;
    name: string;
  };
  members?: ProjectMember[];
  _count?: {
    tasks: number;
    members: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  employeeId: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    position?: {
      title: string;
    };
  };
  role: 'OWNER' | 'MANAGER' | 'MEMBER' | 'VIEWER';
  joinedAt: string;
  leftAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  startDate?: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours: number;
  assigneeId?: string;
  assignee?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  projectId: string;
  parentId?: string;
  position: number;
  tags: string[];
  _count?: {
    subtasks: number;
    comments: number;
    attachments: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  taskId?: string;
  task?: {
    id: string;
    title: string;
  };
  employeeId: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
  };
  startTime: string;
  endTime?: string;
  duration?: number;
  description?: string;
  isBillable: boolean;
  hourlyRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  totalTimeLogged: number;
}
