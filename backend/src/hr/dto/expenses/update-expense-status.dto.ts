import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class UpdateExpenseStatusDto {
  @IsIn(['APPROVED', 'REJECTED', 'REIMBURSED'])
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
