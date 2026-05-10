import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsIn,
  IsNotEmpty,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  @IsIn(['LEAD', 'PROSPECT', 'CLIENT', 'PARTNER'])
  status?: string;

  @IsString()
  @IsOptional()
  @IsIn(['WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'EVENT', 'OTHER'])
  source?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsOptional()
  ownerId?: string;
}
