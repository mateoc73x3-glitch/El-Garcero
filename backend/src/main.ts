import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const corsOrigin = config.get<string>('CORS_ORIGIN', 'http://localhost:5173');
  const port = config.get<number>('PORT', 3000);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: corsOrigin.split(',').map((value) => value.trim()),
    methods: ['GET', 'POST'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port);
}

void bootstrap();
