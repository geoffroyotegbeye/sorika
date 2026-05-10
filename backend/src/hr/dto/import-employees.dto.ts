import { IsString, IsOptional, IsEmail, IsNumber, IsBoolean } from 'class-validator';

export class ImportEmployeeDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  positionTitle?: string; // Titre du poste (sera converti en positionId)

  @IsString()
  @IsOptional()
  departmentName?: string; // Nom du département (sera converti en departmentId)

  @IsString()
  @IsOptional()
  managerEmail?: string; // Email du manager (sera converti en managerId)

  @IsString()
  @IsOptional()
  hireDate?: string;

  @IsString()
  @IsOptional()
  contractType?: string;

  @IsNumber()
  @IsOptional()
  salary?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
