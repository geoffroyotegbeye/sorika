import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateLeaveTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @IsBoolean()
  @IsOptional()
  requiresApproval?: boolean;

  @IsString()
  @IsOptional()
  color?: string;
}
