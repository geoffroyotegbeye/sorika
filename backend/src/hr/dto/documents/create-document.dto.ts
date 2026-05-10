import { IsString, IsNotEmpty, IsIn, IsOptional, IsNumber } from 'class-validator';

export class CreateEmployeeDocumentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(['CONTRACT', 'IDENTITY', 'DIPLOMA', 'CERTIFICATE', 'OTHER'])
  category: string;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsNumber()
  @IsOptional()
  fileSize?: number;

  @IsString()
  @IsOptional()
  mimeType?: string;
}
