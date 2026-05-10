import {
  IsEmail,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  IsNotEmpty,
  MinLength,
  IsBoolean,
} from 'class-validator';

export class CreateMemberDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  username?: string;

  /**
   * Mot de passe fourni manuellement.
   * Si absent, le backend en génère un automatiquement.
   */
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsIn(['ADMIN', 'STAFF'])
  role: 'ADMIN' | 'STAFF';

  @IsObject()
  @IsOptional()
  permissions?: Record<string, string[]>;

  /**
   * Si true, le membre devra changer son mot de passe à la première connexion.
   */
  @IsBoolean()
  @IsOptional()
  mustChangePassword?: boolean;
}
