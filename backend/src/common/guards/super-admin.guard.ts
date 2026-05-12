import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'] as string | undefined;

    if (!userId) {
      throw new UnauthorizedException('Authentification requise');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isSuperAdmin: true },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    if (!user.isSuperAdmin) {
      throw new ForbiddenException('Accès réservé aux Super Admins');
    }

    request.adminUser = user;
    return true;
  }
}
