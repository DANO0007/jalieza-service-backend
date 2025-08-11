import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.use(cookieParser()); // ✅ Habilita cookies

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8100', // ⚠️ Cambia esto si usas otro frontend
    credentials: true, // ✅ Permite enviar cookies entre frontend y backend
  });

  await app.listen(process.env.PORT ?? 3000,'0.0.0.0');
}
bootstrap();
