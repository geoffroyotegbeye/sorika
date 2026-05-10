import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { MembersService } from './members.service';
import { UpdateMemberDto } from './dto/update-member.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';
import { PermissionGuard } from '../common/guards/permission.guard';

@Controller('companies/:companyId/members')
@UseGuards(PermissionGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  listMembers(@Param('companyId') companyId: string) {
    return this.membersService.listMembers(companyId);
  }

  /** Liste des rôles prédéfinis disponibles */
  @Get('roles')
  listRoles() {
    return this.membersService.listAvailableRoles();
  }

  /** Création directe d'un membre (User + Membership en une transaction) */
  @Post()
  createMember(
    @Param('companyId') companyId: string,
    @Body() dto: CreateMemberDto,
    @Req() req: any,
  ) {
    const requesterId = req.headers['x-user-id'];
    return this.membersService.createMember(companyId, dto, requesterId);
  }

  @Patch(':membershipId')
  updateMember(
    @Param('companyId') companyId: string,
    @Param('membershipId') membershipId: string,
    @Body() dto: UpdateMemberDto,
    @Req() req: any,
  ) {
    const requesterId = req.headers['x-user-id'];
    return this.membersService.updateMember(companyId, membershipId, dto, requesterId);
  }

  @Delete(':membershipId')
  removeMember(
    @Param('companyId') companyId: string,
    @Param('membershipId') membershipId: string,
    @Req() req: any,
  ) {
    const requesterId = req.headers['x-user-id'];
    return this.membersService.removeMember(companyId, membershipId, requesterId);
  }

  /** Réinitialisation du mot de passe d'un membre */
  @Post(':membershipId/reset-password')
  resetPassword(
    @Param('companyId') companyId: string,
    @Param('membershipId') membershipId: string,
    @Body() dto: ResetPasswordDto,
    @Req() req: any,
  ) {
    const requesterId = req.headers['x-user-id'];
    return this.membersService.resetPassword(companyId, membershipId, dto, requesterId);
  }

  /** Mise à jour des permissions avec rôles prédéfinis */
  @Patch(':membershipId/permissions')
  updatePermissions(
    @Param('companyId') companyId: string,
    @Param('membershipId') membershipId: string,
    @Body() dto: UpdatePermissionsDto,
    @Req() req: any,
  ) {
    const requesterId = req.headers['x-user-id'];
    return this.membersService.updatePermissions(companyId, membershipId, dto, requesterId);
  }
}
