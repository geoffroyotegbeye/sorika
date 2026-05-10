import {
  IsString,
  IsOptional,
  IsIn,
  IsNotEmpty,
  IsUrl,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  @IsIn(['SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE'])
  size?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  ownerId?: string;
}
