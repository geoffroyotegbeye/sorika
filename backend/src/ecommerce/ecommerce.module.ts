import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EcommerceController } from './ecommerce.controller';
import { EcommerceService } from './ecommerce.service';

@Module({
  imports: [PrismaModule],
  controllers: [EcommerceController],
  providers: [EcommerceService],
  exports: [EcommerceService],
})
export class EcommerceModule {}