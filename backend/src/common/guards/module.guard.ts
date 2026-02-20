import { Injectable, CanActivate, ExecutionContext, ForbiddenException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

// Décorateur pour spécifier le module requis
export const RequireModule = (module: string) => SetMetadata('requiredModule', module);

@Injectable()
export class ModuleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Récupérer le module requis depuis le décorateur
    const requiredModule = this.reflector.get<string>('requiredModule', context.getHandler());
    
    if (!requiredModule) {
      return true; // Pas de module requis, on laisse passer
    }

    const request = context.switchToHttp().getRequest();
    const companyId = request.params.companyId || request.user?.companyId;

    if (!companyId) {
      throw new ForbiddenException('ID de l\'entreprise manquant');
    }

    // Vérifier si l'entreprise possède le module
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { modules: true },
    });

    if (!company) {
      throw new ForbiddenException('Entreprise introuvable');
    }

    if (!company.modules.includes(requiredModule)) {
      throw new ForbiddenException(
        `Votre entreprise n'a pas accès au module ${requiredModule}. Veuillez l'activer dans vos paramètres.`,
      );
    }

    return true;
  }
}
