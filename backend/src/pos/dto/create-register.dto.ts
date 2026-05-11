import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateRegisterDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
