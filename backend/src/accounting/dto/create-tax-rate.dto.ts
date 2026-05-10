import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class CreateTaxRateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  rate: number;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
