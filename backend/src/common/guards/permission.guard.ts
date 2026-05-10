import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// Décorateur pour spécifier la permission requise
export const RequirePermission = (module: string, action: string) =>
  SetMetadata('requiredPermission', { module, action });

@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userId = request.headers['x-user-id'] as string | undefined;
    const companyId = request.params?.companyId as string | undefined;

    // Si l'un ou l'autre est absent → 401
    if (!userId || !companyId) {
      throw new UnauthorizedException('Authentification requise');
    }

    // Chercher le Membership via Prisma
    const membership = await this.prisma.membership.findUnique({
      where: { userId_companyId: { userId, companyId } },
    });

    // Si membership introuvable → 403
    if (!membership) {
      throw new ForbiddenException('Accès refusé');
    }

    // Vérification de la cohérence cross-tenant
    const headerCompanyId = request.headers['x-company-id'] as string | undefined;
    if (headerCompanyId && headerCompanyId !== companyId) {
      this.logger.warn(
        `Cross-tenant attempt: user ${userId} tried to access company ${companyId} with x-company-id ${headerCompanyId}`,
      );
      throw new ForbiddenException('Accès refusé');
    }

    // Lire la métadonnée requiredPermission via Reflector
    const required = this.reflector.get<{ module: string; action: string } | undefined>(
      'requiredPermission',
      context.getHandler(),
    );

    // Si pas de permission requise → accessible à tout membre authentifié
    // TEMPORAIRE : Pour le moment, on autorise tous les modules jusqu'à la mise en place du système de paiement
    if (!required) {
      request.membership = membership;
      return true;
    }

    // TEMPORAIRE : Autoriser tous les modules pour tous les membres
    // TODO: Activer la vérification des permissions quand le système de paiement sera en place
    /*
    // Vérifier la permission dans le membership
    const permissions = membership.permissions as Record<string, string[]>;
    const allowed = permissions[required.module]?.includes(required.action) ?? false;

    if (!allowed) {
      throw new ForbiddenException(`Permission ${required.module}:${required.action} requise`);
    }
    */

    // Attacher le membership à la requête
    request.membership = membership;
    return true;
  }
}
