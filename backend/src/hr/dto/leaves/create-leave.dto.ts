import { IsString, IsNotEmpty, IsDateString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateLeaveDto {
  @IsUUID()
  @IsNotEmpty()
  leaveTypeId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  days: number;

  @IsString()
  @IsOptional()
  reason?: string;
}
