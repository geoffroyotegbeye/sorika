import { IsString, IsIn, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class UpdateStageDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'])
  stage: string;

  @IsDateString()
  @IsOptional()
  actualCloseDate?: string;

  @IsString()
  @IsOptional()
  lostReason?: string;
}
