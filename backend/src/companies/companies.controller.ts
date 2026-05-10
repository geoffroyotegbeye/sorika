import { Controller, Get, Post, Delete, Param, Patch, Body, UseGuards, Req, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { PermissionGuard } from '../common/guards/permission.guard';
import { UpdateCompanySettingsDto } from './dto/update-company-settings.dto';
import { CreatePublicHolidayDto } from './dto/create-public-holiday.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.companiesService.findBySlug(slug);
  }

  @UseGuards(PermissionGuard)
  @Get(':companyId/settings')
  async getSettings(@Param('companyId') companyId: string) {
    return this.companiesService.getSettings(companyId);
  }

  @UseGuards(PermissionGuard)
  @Patch(':companyId/settings')
  async updateSettings(
    @Param('companyId') companyId: string,
    @Body() dto: UpdateCompanySettingsDto,
    @Req() req: any,
  ) {
    const userId = req.headers['x-user-id'];
    return this.companiesService.updateSettings(companyId, dto, userId);
  }

  // ── Gestion des jours fériés ──

  @UseGuards(PermissionGuard)
  @Get(':companyId/public-holidays')
  async listPublicHolidays(
    @Param('companyId') companyId: string,
    @Query('year') year?: string,
  ) {
    const yearNum = year ? parseInt(year, 10) : undefined;
    return this.companiesService.listPublicHolidays(companyId, yearNum);
  }

  @UseGuards(PermissionGuard)
  @Post(':companyId/public-holidays')
  async createPublicHoliday(
    @Param('companyId') companyId: string,
    @Body() dto: CreatePublicHolidayDto,
    @Req() req: any,
  ) {
    const userId = req.headers['x-user-id'];
    return this.companiesService.createPublicHoliday(companyId, dto, userId);
  }

  @UseGuards(PermissionGuard)
  @Delete(':companyId/public-holidays/:holidayId')
  async deletePublicHoliday(
    @Param('companyId') companyId: string,
    @Param('holidayId') holidayId: string,
    @Req() req: any,
  ) {
    const userId = req.headers['x-user-id'];
    return this.companiesService.deletePublicHoliday(companyId, holidayId, userId);
  }

  @UseGuards(PermissionGuard)
  @Post(':companyId/public-holidays/initialize-defaults')
  async initializeDefaultHolidays(
    @Param('companyId') companyId: string,
    @Req() req: any,
  ) {
    const userId = req.headers['x-user-id'];
    return this.companiesService.initializeDefaultHolidays(companyId, userId);
  }
}
