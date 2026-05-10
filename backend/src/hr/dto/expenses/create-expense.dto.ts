import { IsString, IsNotEmpty, IsNumber, IsDateString, IsIn, IsOptional } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsIn(['TRANSPORT', 'MEAL', 'ACCOMMODATION', 'OTHER'])
  category: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  receiptUrl?: string;
}
