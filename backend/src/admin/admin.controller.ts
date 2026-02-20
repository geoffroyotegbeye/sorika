import { Controller, Get, Delete, Param, Put, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('companies')
  getAllCompanies() {
    return this.adminService.getAllCompanies();
  }

  @Delete('users/:userId')
  deleteUser(@Param('userId') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  @Delete('companies/:companyId')
  deleteCompany(@Param('companyId') companyId: string) {
    return this.adminService.deleteCompany(companyId);
  }

  @Put('users/:userId/super-admin')
  toggleSuperAdmin(
    @Param('userId') userId: string,
    @Body('isSuperAdmin') isSuperAdmin: boolean,
  ) {
    return this.adminService.toggleSuperAdmin(userId, isSuperAdmin);
  }
}
