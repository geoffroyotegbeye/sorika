import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class UpdateLeaveStatusDto {
  @IsIn(['APPROVED', 'REJECTED', 'CANCELLED'])
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
