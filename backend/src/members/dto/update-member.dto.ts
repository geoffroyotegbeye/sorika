import { IsIn, IsObject, IsOptional } from 'class-validator';

export class UpdateMemberDto {
  @IsIn(['ADMIN', 'STAFF'])
  @IsOptional()
  role?: 'ADMIN' | 'STAFF';

  @IsObject()
  @IsOptional()
  permissions?: Record<string, string[]>;
}
