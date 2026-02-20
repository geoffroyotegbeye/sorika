import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Controller('companies/:companyId/pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() createPageDto: CreatePageDto,
  ) {
    return this.pagesService.create(companyId, createPageDto);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.pagesService.findAll(companyId);
  }

  @Get('home')
  async findHomePage(@Param('companyId') companyId: string) {
    const page = await this.pagesService.findHomePage(companyId);
    const globalElements = await this.pagesService.getGlobalElements(companyId);
    const pageElements = Array.isArray(page?.elements) ? page.elements : [];
    return { ...page, elements: [...globalElements, ...pageElements] };
  }

  @Get(':slug')
  async findOne(
    @Param('companyId') companyId: string,
    @Param('slug') slug: string,
  ) {
    const page = await this.pagesService.findOne(companyId, slug);
    const globalElements = await this.pagesService.getGlobalElements(companyId);
    const pageElements = Array.isArray(page?.elements) ? page.elements : [];
    return { ...page, elements: [...globalElements, ...pageElements] };
  }

  @Put(':slug')
  update(
    @Param('companyId') companyId: string,
    @Param('slug') slug: string,
    @Body() updatePageDto: UpdatePageDto,
  ) {
    return this.pagesService.update(companyId, slug, updatePageDto);
  }

  @Put(':slug/elements')
  updateElements(
    @Param('companyId') companyId: string,
    @Param('slug') slug: string,
    @Body('elements') elements: any[],
  ) {
    return this.pagesService.updateElements(companyId, slug, elements);
  }

  @Post(':slug/publish')
  publish(
    @Param('companyId') companyId: string,
    @Param('slug') slug: string,
  ) {
    return this.pagesService.publish(companyId, slug);
  }

  @Post(':slug/unpublish')
  unpublish(
    @Param('companyId') companyId: string,
    @Param('slug') slug: string,
  ) {
    return this.pagesService.unpublish(companyId, slug);
  }

  @Delete(':slug')
  remove(
    @Param('companyId') companyId: string,
    @Param('slug') slug: string,
  ) {
    return this.pagesService.remove(companyId, slug);
  }

  @Post('publish-all')
  publishAll(@Param('companyId') companyId: string) {
    return this.pagesService.publishAll(companyId);
  }

  @Post('unpublish-all')
  unpublishAll(@Param('companyId') companyId: string) {
    return this.pagesService.unpublishAll(companyId);
  }
}
