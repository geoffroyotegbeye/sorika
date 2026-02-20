import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  /**
   * Login - Authentification
   */
  async login(dto: LoginDto) {
    // Trouver l'utilisateur
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        memberships: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Retourner les infos utilisateur (sans le mot de passe)
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      companies: user.memberships.map((m) => ({
        id: m.company.id,
        name: m.company.name,
        slug: m.company.slug,
        role: m.role,
      })),
    };
  }

  /**
   * Inscription avec transaction Prisma
   * Crée l'utilisateur, la compagnie, et le membership en une seule transaction
   */
  async register(dto: RegisterDto) {
    // Vérifier si l'email existe déjà
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Vérifier si le slug est déjà pris
    const existingCompany = await this.prisma.company.findUnique({
      where: { slug: dto.companySlug },
    });

    if (existingCompany) {
      throw new ConflictException('Ce nom de domaine est déjà pris');
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Transaction Prisma : Tout ou rien
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Créer l'utilisateur
      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      // 2. Créer la compagnie avec les modules
      const company = await tx.company.create({
        data: {
          name: dto.companyName,
          slug: dto.companySlug,
          phoneNumber: dto.phoneNumber,
          modules: dto.modules || ['LANDING_PAGE'], // Par défaut LANDING_PAGE
        },
      });

      // 3. Créer le membership (lien utilisateur-compagnie)
      const membership = await tx.membership.create({
        data: {
          userId: user.id,
          companyId: company.id,
          role: 'OWNER', // Le créateur est propriétaire
        },
      });

      // 4. Si LANDING_PAGE est activé, créer la page d'accueil par défaut
      if (company.modules.includes('LANDING_PAGE')) {
        await tx.page.create({
          data: {
            companyId: company.id,
            slug: '',
            title: 'Accueil',
            description: 'Page d\'accueil',
            isHomePage: true,
            isPublished: false,
            elements: [],
            metaTitle: company.name,
            metaDescription: `Découvrez ${company.name} - Services professionnels`,
          },
        });
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        company: {
          id: company.id,
          name: company.name,
          slug: company.slug,
          modules: company.modules,
        },
        membership: {
          role: membership.role,
        },
      };
    });

    return result;
  }
}
