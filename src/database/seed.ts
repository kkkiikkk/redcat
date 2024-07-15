import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserSeederService } from './seeds/userSeeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(UserSeederService);

  await seeder.seed();
  await app.close();
}

bootstrap();
