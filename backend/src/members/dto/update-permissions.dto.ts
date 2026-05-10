import { IsIn, IsOptional, IsObject } from 'class-validator';
import type { PermissionsMap } from '../../common/constants/roles';

export class UpdatePermissionsDto {
  @IsIn(['ADMIN_ACCESS', 'EDITOR', 'READ_ONLY', 'CUSTOM'])
  @IsOptional()
  roleType?: 'ADMIN_ACCESS' | 'EDITOR' | 'READ_ONLY' | 'CUSTOM';

  @IsObject()
  @IsOptional()
  permissions?: PermissionsMap;
}
