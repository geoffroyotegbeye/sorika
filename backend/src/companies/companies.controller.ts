import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.companiesService.findBySlug(slug);
  }
}
