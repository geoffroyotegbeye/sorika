import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    bodyParser: true,
  });
  
  const logger = new Logger('Bootstrap');
  
  // Configurer la taille limite des requêtes (10MB pour les médias)
  app.use(require('express').json({ limit: '10mb' }));
  app.use(require('express').urlencoded({ limit: '10mb', extended: true }));
  
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
