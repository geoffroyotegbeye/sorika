import { IsString, IsNotEmpty, IsDateString, IsUUID, IsIn, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @IsUUID()
  @IsOptional()
  positionId?: string;

  @IsDateString()
  @IsOptional()
  hireDate?: string;

  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @IsUUID()
  @IsOptional()
  managerId?: string;

  @IsIn(['CDI', 'CDD', 'FREELANCE', 'STAGE', 'ALTERNANCE', 'PRESTATION'])
  @IsOptional()
  contractType?: string;

  @IsNumber()
  @IsOptional()
  baseSalary?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsUUID()
  @IsOptional()
  userId?: string;
}
