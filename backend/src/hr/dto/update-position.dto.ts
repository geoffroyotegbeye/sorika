import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdatePositionDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsIn(['EXECUTIVE', 'MANAGER', 'STAFF', 'INTERN'])
  level?: string;
}
