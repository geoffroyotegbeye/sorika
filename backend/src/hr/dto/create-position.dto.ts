import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsIn(['EXECUTIVE', 'MANAGER', 'STAFF', 'INTERN'])
  level?: string;
}
