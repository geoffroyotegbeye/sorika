import { IsEmail, IsIn, IsObject, IsOptional } from 'class-validator';

export class InviteMemberDto {
  @IsEmail()
  email: string;

  @IsIn(['ADMIN', 'STAFF'])
  role: 'ADMIN' | 'STAFF';

  @IsObject()
  @IsOptional()
  permissions?: Record<string, string[]>;
}
