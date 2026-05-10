import { IsString, IsDateString, IsOptional, IsIn, IsNumber } from 'class-validator';

export class CreateAttendanceDto {
  @IsDateString()
  date: string;

  @IsDateString()
  @IsOptional()
  checkIn?: string;

  @IsDateString()
  @IsOptional()
  checkOut?: string;

  @IsNumber()
  @IsOptional()
  hoursWorked?: number;

  @IsString()
  @IsIn(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'REMOTE'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
