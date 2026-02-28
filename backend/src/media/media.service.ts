import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async uploadMedia(companyId: string, file: Express.Multer.File) {
    const uploadDir = path.join(process.cwd(), 'uploads', companyId);
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(uploadDir, filename);
    
    fs.writeFileSync(filepath, file.buffer);

    const media = await this.prisma.media.create({
      data: {
        filename: file.originalname,
        filepath: `uploads/${companyId}/${filename}`,
        mimetype: file.mimetype,
        size: file.size,
        url: `/uploads/${companyId}/${filename}`,
        companyId,
      },
    });

    return media;
  }

  async getMediasByCompany(companyId: string) {
    return this.prisma.media.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteMedia(id: string, companyId: string) {
    const media = await this.prisma.media.findFirst({
      where: { id, companyId },
    });

    if (!media) {
      throw new Error('Media not found');
    }

    const filepath = path.join(process.cwd(), media.filepath);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    await this.prisma.media.delete({ where: { id } });

    return { success: true };
  }

  getMediaFile(companyId: string, filename: string) {
    const filepath = path.join(process.cwd(), 'uploads', companyId, filename);
    
    if (!fs.existsSync(filepath)) {
      throw new Error('File not found');
    }

    return filepath;
  }
}
