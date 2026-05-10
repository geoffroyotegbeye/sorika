import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMemberDto } from './dto/update-member.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';
import { getRolePermissions, PREDEFINED_ROLES, type PredefinedRoleName } from '../common/constants/roles';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

type Role = 'OWNER' | 'ADMIN' | 'STAFF';
type Permissions = Record<string, string[]>;

/** Génère un mot de passe aléatoire de 12 caractères (lettres + chiffres + symboles) */
function generatePassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
  const bytes = randomBytes(12);
  return Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join('');
}

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  async listMembers(companyId: string) {
    const memberships = await this.prisma.membership.findMany({
      where: { companyId },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'asc' },
    });

    const now = new Date();
    const invitations = await this.prisma.invitation.findMany({
      where: { companyId, usedAt: null, expiresAt: { gt: now } },
      orderBy: { createdAt: 'desc' },
    });

    return {
      members: memberships.map((m) => ({
        id: m.id,
        userId: m.userId,
        firstName: m.user.firstName,
        lastName: m.user.lastName,
        email: m.user.email,
        role: m.role,
        permissions: m.permissions,
        joinedAt: m.createdAt,
      })),
      invitations,
    };
  }

  async updateMember(companyId: string, membershipId: string, dto: UpdateMemberDto, requesterId: string) {
    // Vérifier que le requester est OWNER
    const requesterMembership = await this.prisma.membership.findUnique({
      where: { userId_companyId: { userId: requesterId, companyId } },
    });
    if (!requesterMembership || requesterMembership.role !== 'OWNER') {
      throw new ForbiddenException('Seul le propriétaire peut modifier les membres');
    }

    const target = await this.prisma.membership.findFirst({
      where: { id: membershipId, companyId },
    });
    if (!target) throw new NotFoundException('Membre introuvable');
    if (target.role === 'OWNER') throw new ForbiddenException("Le rôle OWNER ne peut pas être modifié");

    const newRole = dto.role ?? target.role;
    const newPermissions = dto.role
      ? this.getDefaultPermissions(newRole as Role, await this.getCompanyModules(companyId))
      : (dto.permissions ?? target.permissions);

    return this.prisma.membership.update({
      where: { id: membershipId },
      data: { role: newRole, permissions: newPermissions as any },
    });
  }

  async removeMember(companyId: string, membershipId: string, requesterId: string) {
    const requesterMembership = await this.prisma.membership.findUnique({
      where: { userId_companyId: { userId: requesterId, companyId } },
    });
    if (!requesterMembership) throw new ForbiddenException('Accès refusé');

    const target = await this.prisma.membership.findFirst({
      where: { id: membershipId, companyId },
    });
    if (!target) throw new NotFoundException('Membre introuvable');
    if (target.role === 'OWNER') throw new ForbiddenException("L'OWNER ne peut pas être retiré");

    if (requesterMembership.role === 'ADMIN' && target.role !== 'STAFF') {
      throw new ForbiddenException("Un ADMIN ne peut retirer que les membres STAFF");
    }

    await this.prisma.membership.delete({ where: { id: membershipId } });
  }

  getDefaultPermissions(role: Role, modules: string[]): Permissions {
    const allActions = ['READ', 'CREATE', 'UPDATE', 'DELETE'];
    if (role === 'OWNER') {
      return Object.fromEntries(modules.map((m) => [m, allActions]));
    }
    if (role === 'ADMIN') {
      return Object.fromEntries(modules.map((m) => [m, ['READ', 'CREATE']]));
    }
    return Object.fromEntries(modules.map((m) => [m, ['READ']]));
  }

  private async getCompanyModules(companyId: string): Promise<string[]> {
    const company = await this.prisma.company.findUnique({ where: { id: companyId }, select: { modules: true } });
    return company?.modules ?? [];
  }

  // ─── Création directe d'un membre ────────────────────────────────────────────

  async createMember(companyId: string, dto: CreateMemberDto, requesterId: string) {
    // Seul OWNER ou ADMIN peut créer un membre
    const requester = await this.prisma.membership.findUnique({
      where: { userId_companyId: { userId: requesterId, companyId } },
    });
    if (!requester || !['OWNER', 'ADMIN'].includes(requester.role)) {
      throw new ForbiddenException('Seul un OWNER ou ADMIN peut ajouter des membres');
    }

    // Vérifier unicité email
    const existingEmail = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingEmail) {
      // Si l'utilisateur existe déjà, vérifier qu'il n'est pas déjà membre
      const existingMembership = await this.prisma.membership.findUnique({
        where: { userId_companyId: { userId: existingEmail.id, companyId } },
      });
      if (existingMembership) {
        throw new ConflictException('Cet utilisateur est déjà membre de l\'organisation');
      }
      throw new ConflictException('Un compte avec cet email existe déjà');
    }

    // Vérifier unicité username si fourni
    if (dto.username) {
      const existingUsername = await this.prisma.user.findUnique({ where: { username: dto.username } });
      if (existingUsername) {
        throw new ConflictException('Ce nom d\'utilisateur est déjà pris');
      }
    }

    // Générer ou utiliser le mot de passe fourni
    const plainPassword = dto.password ?? generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const modules = await this.getCompanyModules(companyId);
    const permissions = dto.permissions ?? this.getDefaultPermissions(dto.role, modules);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          firstName: dto.firstName,
          lastName: dto.lastName,
          password: hashedPassword,
          mustChangePassword: dto.mustChangePassword ?? false,
        },
      });

      const membership = await tx.membership.create({
        data: {
          userId: user.id,
          companyId,
          role: dto.role,
          permissions: permissions as any,
        },
      });

      return { user, membership };
    });

    // Retourner les infos sans le hash, mais avec le mot de passe en clair si généré
    const { password: _hash, ...userWithoutPassword } = result.user;
    return {
      user: userWithoutPassword,
      membership: result.membership,
      // Retourner le mot de passe en clair uniquement s'il a été généré automatiquement
      ...(dto.password ? {} : { generatedPassword: plainPassword }),
    };
  }

  // ─── Liste des rôles prédéfinis ──────────────────────────────────────────────

  async listAvailableRoles() {
    return Object.entries(PREDEFINED_ROLES).map(([key, role]) => ({
      id: key,
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    }));
  }

  // ─── Mise à jour des permissions (avec rôles prédéfinis) ─────────────────────

  async updatePermissions(companyId: string, membershipId: string, dto: UpdatePermissionsDto, requesterId: string) {
    // Vérifier que le requester est membre de l'organisation
    const requester = await this.prisma.membership.findUnique({
      where: { userId_companyId: { userId: requesterId, companyId } },
    });
    if (!requester) {
      throw new ForbiddenException('Accès refusé');
    }

    // Récupérer le membership cible
    const target = await this.prisma.membership.findFirst({
      where: { id: membershipId, companyId },
    });
    if (!target) throw new NotFoundException('Membre introuvable');

    // Seul OWNER peut modifier les permissions, ou l'utilisateur peut modifier ses propres permissions
    const isSelf = target.userId === requesterId;
    const isOwner = requester.role === 'OWNER';

    if (!isSelf && !isOwner) {
      throw new ForbiddenException('Seul le propriétaire peut modifier les permissions des autres membres');
    }

    // Déterminer les nouvelles permissions
    let newPermissions: Permissions;

    if (dto.roleType && dto.roleType !== 'CUSTOM') {
      // Utiliser un rôle prédéfini
      newPermissions = getRolePermissions(dto.roleType as PredefinedRoleName);
    } else if (dto.permissions) {
      // Utiliser des permissions personnalisées
      newPermissions = dto.permissions;
    } else {
      throw new ForbiddenException('Vous devez spécifier soit un roleType soit des permissions personnalisées');
    }

    // Mettre à jour les permissions
    return this.prisma.membership.update({
      where: { id: membershipId },
      data: { permissions: newPermissions as any },
    });
  }

  // ─── Réinitialisation du mot de passe ────────────────────────────────────────

  async resetPassword(companyId: string, membershipId: string, dto: ResetPasswordDto, requesterId: string) {
    // Seul OWNER ou ADMIN peut réinitialiser un mot de passe
    const requester = await this.prisma.membership.findUnique({
      where: { userId_companyId: { userId: requesterId, companyId } },
    });
    if (!requester || !['OWNER', 'ADMIN'].includes(requester.role)) {
      throw new ForbiddenException('Seul un OWNER ou ADMIN peut réinitialiser un mot de passe');
    }

    const target = await this.prisma.membership.findFirst({
      where: { id: membershipId, companyId },
      include: { user: true },
    });
    if (!target) throw new NotFoundException('Membre introuvable');

    // ADMIN ne peut pas réinitialiser le mot de passe d'un OWNER ou d'un autre ADMIN
    if (requester.role === 'ADMIN' && target.role !== 'STAFF') {
      throw new ForbiddenException('Un ADMIN ne peut réinitialiser que le mot de passe des membres STAFF');
    }

    const plainPassword = dto.newPassword ?? generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await this.prisma.user.update({
      where: { id: target.userId },
      data: {
        password: hashedPassword,
        mustChangePassword: dto.mustChangePassword ?? true,
      },
    });

    return {
      message: 'Mot de passe réinitialisé avec succès',
      mustChangePassword: dto.mustChangePassword ?? true,
      // Retourner le mot de passe en clair uniquement s'il a été généré automatiquement
      ...(dto.newPassword ? {} : { generatedPassword: plainPassword }),
    };
  }
}
