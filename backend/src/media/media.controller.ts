import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post(':companyId/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @Param('companyId') companyId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mediaService.uploadMedia(companyId, file);
  }

  @Get(':companyId')
  async getMedias(@Param('companyId') companyId: string) {
    return this.mediaService.getMediasByCompany(companyId);
  }

  @Get(':companyId/:filename')
  async getMediaFile(
    @Param('companyId') companyId: string,
    @Param('filename') filename: string,
  ) {
    const s3Url = this.mediaService.getMediaFile(companyId, filename);
    return { url: s3Url };
  }

  @Delete(':companyId/:id')
  async deleteMedia(
    @Param('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.mediaService.deleteMedia(id, companyId);
  }
}
