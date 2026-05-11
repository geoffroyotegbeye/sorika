import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  Min,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SaleItemDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;
}

export class SalePaymentDto {
  @IsEnum(['CASH', 'CARD', 'MOBILE_MONEY'])
  method: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  reference?: string;
}

export class CreateSaleDto {
  @IsString()
  registerId: string;

  @IsString()
  sessionId: string;

  @IsString()
  cashierId: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPercent?: number;

  @IsEnum(['CASH', 'CARD', 'MOBILE_MONEY', 'MIXED'])
  paymentMethod: string;

  @IsNumber()
  @Min(0)
  amountPaid: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalePaymentDto)
  payments?: SalePaymentDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}
