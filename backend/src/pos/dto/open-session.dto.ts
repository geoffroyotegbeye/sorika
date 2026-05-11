import { IsString, IsNumber, Min } from 'class-validator';

export class OpenSessionDto {
  @IsString()
  registerId: string;

  @IsString()
  cashierId: string;

  @IsNumber()
  @Min(0)
  openingAmount: number;
}
