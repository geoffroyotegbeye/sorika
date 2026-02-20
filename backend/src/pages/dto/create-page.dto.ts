import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreatePageDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  elements?: any[];

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsString()
  ogImage?: string;

  @IsOptional()
  @IsBoolean()
  isHomePage?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
