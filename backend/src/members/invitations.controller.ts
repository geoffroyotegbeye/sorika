import { Controller, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InviteMemberDto } from './dto/invite-member.dto';
import { PermissionGuard } from '../common/guards/permission.guard';

@Controller()
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post('companies/:companyId/members/invite')
  @UseGuards(PermissionGuard)
  createInvitation(
    @Param('companyId') companyId: string,
    @Body() dto: InviteMemberDto,
    @Req() req: any,
  ) {
    const requesterId = req.headers['x-user-id'];
    return this.invitationsService.createInvitation(companyId, dto, requesterId);
  }

  @Delete('companies/:companyId/members/invitations/:invitationId')
  @UseGuards(PermissionGuard)
  cancelInvitation(
    @Param('companyId') companyId: string,
    @Param('invitationId') invitationId: string,
    @Req() req: any,
  ) {
    const requesterId = req.headers['x-user-id'];
    return this.invitationsService.cancelInvitation(companyId, invitationId, requesterId);
  }

  // Route publique — pas de PermissionGuard
  @Post('invitations/:token/accept')
  acceptInvitation(@Param('token') token: string, @Body('userId') userId: string) {
    return this.invitationsService.acceptInvitation(token, userId);
  }
}
