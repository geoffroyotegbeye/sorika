import { IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class ResetPasswordDto {
  /**
   * Nouveau mot de passe fourni manuellement.
   * Si absent, le backend en génère un automatiquement.
   */
  @IsString()
  @MinLength(8)
  @IsOptional()
  newPassword?: string;

  /**
   * Si true, le membre devra changer son mot de passe à la prochaine connexion.
   * Par défaut true lors d'une réinitialisation.
   */
  @IsBoolean()
  @IsOptional()
  mustChangePassword?: boolean;
}
