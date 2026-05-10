import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
