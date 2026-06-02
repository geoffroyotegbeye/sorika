import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MediaService {
  private s3Client: S3Client;
  private bucketName: string;
  private s3Region: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || '',
      },
    });
    this.bucketName = this.configService.get('S3_BUCKET_NAME') || 'sorika-uploads';
    this.s3Region = this.configService.get('AWS_REGION') || 'us-east-1';
  }

  async uploadMedia(companyId: string, file: Express.Multer.File) {
    const filename = `${companyId}/${Date.now()}-${file.originalname}`;
    
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    const media = await this.prisma.media.create({
      data: {
        filename: file.originalname,
        filepath: filename,
        mimetype: file.mimetype,
        size: file.size,
        url: `https://${this.bucketName}.s3.${this.s3Region}.amazonaws.com/${filename}`,
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

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: media.filepath,
    });

    await this.s3Client.send(command);

    await this.prisma.media.delete({ where: { id } });

    return { success: true };
  }

  getMediaFile(companyId: string, filename: string) {
    // Avec S3, on retourne l'URL directe, pas le fichier local
    const s3Url = `https://${this.bucketName}.s3.${this.s3Region}.amazonaws.com/${companyId}/${filename}`;
    return s3Url;
  }
}
