import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsOptional()
  method?: string; // CASH, BANK_TRANSFER, CHECK, MOBILE_MONEY, CARD

  @IsString()
  @IsOptional()
  reference?: string;

  @IsDateString()
  @IsOptional()
  paidAt?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
