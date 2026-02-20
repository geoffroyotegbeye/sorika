import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  
  const logger = new Logger('Bootstrap');
  
  // Activer CORS pour le frontend
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  
  logger.log(`🚀 Application démarrée sur http://localhost:${port}`);
}
bootstrap();
