import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InviteMemberDto } from './dto/invite-member.dto';
import { MembersService } from './members.service';

@Injectable()
export class InvitationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly membersService: MembersService,
  ) {}

  async createInvitation(companyId: string, dto: InviteMemberDto, requesterId: string) {
    // Vérifier que le requester est OWNER ou ADMIN
    const requester = await this.prisma.membership.findUnique({
      where: { userId_companyId: { userId: requesterId, companyId } },
    });
    if (!requester || !['OWNER', 'ADMIN'].includes(requester.role)) {
      throw new ForbiddenException('Seul un OWNER ou ADMIN peut inviter des membres');
    }

    // Vérifier qu'aucun membre existant n'a cet email
    const existingMember = await this.prisma.membership.findFirst({
      where: { companyId, user: { email: dto.email } },
    });
    if (existingMember) throw new ConflictException("Cet utilisateur est déjà membre de l'organisation");

    // Vérifier qu'aucune invitation en attente n'existe
    const now = new Date();
    const existingInvitation = await this.prisma.invitation.findFirst({
      where: { companyId, email: dto.email, usedAt: null, expiresAt: { gt: now } },
    });
    if (existingInvitation) throw new ConflictException('Une invitation est déjà en attente pour cet email');

    // Calculer les permissions
    const company = await this.prisma.company.findUnique({ where: { id: companyId }, select: { modules: true } });
    const permissions =
      dto.permissions ?? this.membersService.getDefaultPermissions(dto.role, company?.modules ?? []);

    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return this.prisma.invitation.create({
      data: { email: dto.email, role: dto.role, permissions, companyId, expiresAt },
    });
  }

  async acceptInvitation(token: string, userId: string) {
    const invitation = await this.prisma.invitation.findUnique({ where: { token } });
    if (!invitation) throw new NotFoundException('Invitation introuvable');

    const now = new Date();
    if (invitation.usedAt !== null) throw new BadRequestException('Cette invitation a déjà été utilisée');
    if (invitation.expiresAt < now) throw new BadRequestException('Cette invitation a expiré');

    return this.prisma.$transaction(async (tx) => {
      const membership = await tx.membership.create({
        data: {
          userId,
          companyId: invitation.companyId,
          role: invitation.role,
          permissions: invitation.permissions as any,
        },
      });
      await tx.invitation.update({ where: { id: invitation.id }, data: { usedAt: now } });
      return membership;
    });
  }

  async cancelInvitation(companyId: string, invitationId: string, requesterId: string) {
    const requester = await this.prisma.membership.findUnique({
      where: { userId_companyId: { userId: requesterId, companyId } },
    });
    if (!requester || !['OWNER', 'ADMIN'].includes(requester.role)) {
      throw new ForbiddenException('Seul un OWNER ou ADMIN peut annuler une invitation');
    }

    const invitation = await this.prisma.invitation.findFirst({ where: { id: invitationId, companyId } });
    if (!invitation) throw new NotFoundException('Invitation introuvable');

    await this.prisma.invitation.delete({ where: { id: invitationId } });
  }
}
