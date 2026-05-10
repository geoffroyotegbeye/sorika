import { IsString, IsDateString, IsUUID, IsOptional } from 'class-validator';

export class CreateAssignmentDto {
  @IsUUID()
  @IsOptional()
  fromPositionId?: string;

  @IsUUID()
  @IsOptional()
  toPositionId?: string;

  @IsUUID()
  @IsOptional()
  fromDepartmentId?: string;

  @IsUUID()
  @IsOptional()
  toDepartmentId?: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsDateString()
  effectiveDate: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
