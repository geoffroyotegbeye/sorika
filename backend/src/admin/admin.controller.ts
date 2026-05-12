import {
  Controller,
  Get,
  Delete,
  Post,
  Param,
  Put,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { SuperAdminGuard } from '../common/guards/super-admin.guard';

@Controller('admin')
@UseGuards(SuperAdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  // ─── Stats globales ───────────────────────────────────────────────────────────

  @Get('stats')
  getGlobalStats() {
    return this.adminService.getGlobalStats();
  }

  // ─── Utilisateurs ─────────────────────────────────────────────────────────────

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:userId')
  getUserById(@Param('userId') userId: string) {
    return this.adminService.getUserById(userId);
  }

  @Delete('users/:userId')
  deleteUser(@Param('userId') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  @Put('users/:userId/super-admin')
  toggleSuperAdmin(
    @Param('userId') userId: string,
    @Body('isSuperAdmin') isSuperAdmin: boolean,
  ) {
    return this.adminService.toggleSuperAdmin(userId, isSuperAdmin);
  }

  @Put('users/:userId/reset-password')
  resetUserPassword(
    @Param('userId') userId: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.adminService.resetUserPassword(userId, newPassword);
  }

  // ─── Entreprises ──────────────────────────────────────────────────────────────

  @Get('companies')
  getAllCompanies() {
    return this.adminService.getAllCompanies();
  }

  @Get('companies/:companyId')
  getCompanyById(@Param('companyId') companyId: string) {
    return this.adminService.getCompanyById(companyId);
  }

  @Delete('companies/:companyId')
  deleteCompany(@Param('companyId') companyId: string) {
    return this.adminService.deleteCompany(companyId);
  }

  // ─── Gestion des modules ──────────────────────────────────────────────────────

  @Get('companies/:companyId/modules')
  getCompanyModules(@Param('companyId') companyId: string) {
    return this.adminService.getCompanyModules(companyId);
  }

  @Put('companies/:companyId/modules')
  updateCompanyModules(
    @Param('companyId') companyId: string,
    @Body('modules') modules: string[],
  ) {
    return this.adminService.updateCompanyModules(companyId, modules);
  }

  @Patch('companies/:companyId/modules/:moduleName')
  toggleCompanyModule(
    @Param('companyId') companyId: string,
    @Param('moduleName') moduleName: string,
    @Body('enabled') enabled: boolean,
  ) {
    return this.adminService.toggleCompanyModule(companyId, moduleName, enabled);
  }

  // ─── Membres d'une entreprise ─────────────────────────────────────────────────

  @Get('companies/:companyId/members')
  getCompanyMembers(@Param('companyId') companyId: string) {
    return this.adminService.getCompanyMembers(companyId);
  }

  @Patch('companies/:companyId/members/:userId/role')
  updateMemberRole(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
    @Body('role') role: string,
  ) {
    return this.adminService.updateMemberRole(companyId, userId, role);
  }

  @Delete('companies/:companyId/members/:userId')
  revokeMemberAccess(
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
  ) {
    return this.adminService.revokeMemberAccess(companyId, userId);
  }

  // ─── Seed données de test ─────────────────────────────────────────────────────

  @Post('companies/:companyId/seed')
  seedCompanyData(@Param('companyId') companyId: string) {
    return this.adminService.seedCompanyData(companyId);
  }
}
