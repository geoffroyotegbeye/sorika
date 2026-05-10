export type Role = 'OWNER' | 'ADMIN' | 'STAFF';
export type ModuleAction = 'READ' | 'CREATE' | 'UPDATE' | 'DELETE';
export type ModuleName = 'CRM' | 'HR' | 'LANDING_PAGE' | 'MEDIA' | 'ECOMMERCE' | 'ANALYTICS' | 'MESSAGING' | 'BLOG';
export type Permissions = Record<string, ModuleAction[]>;

export interface Member {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  email: string;
  role: Role;
  permissions: Permissions;
  joinedAt: string;
}

export interface CreateMemberDto {
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  password?: string;
  role: Role;
  permissions?: Permissions;
  mustChangePassword?: boolean;
}

export interface CreateMemberResponse {
  user: Omit<Member, 'id' | 'role' | 'permissions' | 'joinedAt'>;
  membership: { id: string; role: Role; permissions: Permissions };
  generatedPassword?: string;
}

export interface ResetPasswordDto {
  newPassword?: string;
  mustChangePassword?: boolean;
}

export interface ResetPasswordResponse {
  message: string;
  mustChangePassword: boolean;
  generatedPassword?: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: Role;
  permissions: Permissions;
  expiresAt: string;
  createdAt: string;
}

export interface MembersListResponse {
  members: Member[];
  invitations: Invitation[];
}

export interface PredefinedRole {
  id: string;
  name: string;
  description: string;
  permissions: Permissions;
}

export interface UpdatePermissionsDto {
  roleType?: 'ADMIN_ACCESS' | 'EDITOR' | 'READ_ONLY' | 'CUSTOM';
  permissions?: Permissions;
}
