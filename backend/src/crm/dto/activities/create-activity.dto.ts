import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  IsNotEmpty,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['CALL', 'EMAIL', 'MEETING', 'TASK', 'NOTE'])
  type: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsIn(['PLANNED', 'COMPLETED', 'CANCELLED'])
  status?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsDateString()
  @IsOptional()
  completedAt?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  duration?: number;

  @IsString()
  @IsOptional()
  contactId?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsOptional()
  opportunityId?: string;

  @IsString()
  @IsOptional()
  ownerId?: string;
}
