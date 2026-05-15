import { IsString, IsOptional, IsNumber, IsEnum, IsArray, IsUUID } from 'class-validator';

export class CreatePayrollVariableDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsEnum(['FIXED', 'PERCENTAGE', 'FORMULA'])
  type: 'FIXED' | 'PERCENTAGE' | 'FORMULA';

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsString()
  formula?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  positionId?: string;

  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dependsOn?: string[];
}
