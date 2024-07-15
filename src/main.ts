// Core
import { NestFactory, Reflector } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

// Modules
import { AppModule } from './app.module';

// Instruments
import { ENV } from './utils/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true,
  });

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get(ENV[ENV.PORT]);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Transfer APP')
    .setDescription(
      'API for transfer money, allow to deposit, withdraw and transfer money between users, and also include user authentication',
    )
    .setBasePath('/api')
    .setVersion('1.0')
    .addCookieAuth()
    .build();

  const document = SwaggerModule.createDocument(app, {
    ...config,
  });
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);

  Logger.log(`🚀Server running at http://localhost:${port}`, 'NestApplication');
}
bootstrap();
