import { IsString, IsOptional, IsIn, IsNumber } from 'class-validator';

export class UpdatePositionDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsIn(['EXECUTIVE', 'MANAGER', 'STAFF', 'INTERN'])
  level?: string;

  @IsNumber()
  @IsOptional()
  baseSalary?: number;

  @IsString()
  @IsOptional()
  createdById?: string;

  @IsString()
  @IsOptional()
  updatedById?: string;
}
