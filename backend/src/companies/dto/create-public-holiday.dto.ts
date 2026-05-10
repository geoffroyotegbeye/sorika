import { IsString, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreatePublicHolidayDto {
  @IsString()
  name: string;

  @IsDateString()
  date: string;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;
}
