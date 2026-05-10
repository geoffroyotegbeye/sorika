import { IsString, IsDateString, IsOptional, IsIn } from 'class-validator';

export class UpdateAttendanceDto {
  @IsDateString()
  @IsOptional()
  checkIn?: string;

  @IsDateString()
  @IsOptional()
  checkOut?: string;

  @IsString()
  @IsIn(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'REMOTE'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
