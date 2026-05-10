import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  IsNotEmpty,
  Min,
  Max,
  IsDateString,
} from 'class-validator';

export class CreateOpportunityDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  probability?: number;

  @IsString()
  @IsOptional()
  @IsIn(['LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'])
  stage?: string;

  @IsDateString()
  @IsOptional()
  expectedCloseDate?: string;

  @IsDateString()
  @IsOptional()
  actualCloseDate?: string;

  @IsString()
  @IsOptional()
  lostReason?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  contactId?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsOptional()
  ownerId?: string;
}
