import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LandingPageModule } from './landing-page/landing-page.module';
import { CompaniesModule } from './companies/companies.module';
import { PagesModule } from './pages/pages.module';
import { AdminModule } from './admin/admin.module';
import { MediaModule } from './media/media.module';
import { MembersModule } from './members/members.module';
import { HRModule } from './hr/hr.module';
import { CrmModule } from './crm/crm.module';
import { AccountingModule } from './accounting/accounting.module';
import { InventoryModule } from './inventory/inventory.module';
import { PosModule } from './pos/pos.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ProjectsModule } from './projects/projects.module';
import { EcommerceModule } from './ecommerce/ecommerce.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    LandingPageModule,
    CompaniesModule,
    PagesModule,
    AdminModule,
    MediaModule,
    MembersModule,
    HRModule,
    CrmModule,
    AccountingModule,
    InventoryModule,
    PosModule,
    AnalyticsModule,
    ProjectsModule,
    EcommerceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
