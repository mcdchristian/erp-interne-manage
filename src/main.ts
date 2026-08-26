import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sécurité: Protéger les en-têtes HTTP
  app.use(helmet());

  // Sécurité: Activer CORS (Cross-Origin Resource Sharing)
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*', // À restreindre en production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enable validation globally for all DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips out properties that are not defined in the DTO
      forbidNonWhitelisted: true, // Throws an error if extra properties are sent
      transform: true, // Automatically transforms payloads to DTO instances
    }),
  );

  // Activer le filtre d'exceptions global
  app.useGlobalFilters(new AllExceptionsFilter());

  // Activer les intercepteurs globaux (Logging et Transform de réponse)
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());

  // Définir le préfixe global pour les routes d'API
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('ERP Interne API')
    .setDescription('API backend modulaire pour la gestion des employés, des congés et des rapports')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
