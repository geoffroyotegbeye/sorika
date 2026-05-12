import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class OpenSessionDto {
  @IsString()
  registerId: string;

  @IsOptional()
  @IsString()
  cashierId?: string;

  @IsNumber()
  @Min(0)
  openingAmount: number;
}
