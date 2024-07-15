// Core
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Utils
import { ENV } from '../utils/env';

// Entities
import { User } from '../bus/User/user.entity';
import { Transaction } from '../bus/Transaction/transaction.entity';
import { UserSeederService } from './seeds/userSeeder.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get(ENV[ENV.NODE_ENV]) === 'production';
        return {
          type: 'postgres',
          url: configService.get(ENV[ENV.DB_LINK]),
          entities: [User, Transaction],
          logging: !isProd && false,
          synchronize: !isProd && true,
          dropSchema: !isProd && false,
          seeds: ['dist/databases/seeds/**/*{.ts,.js}'],
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserSeederService],
})
export class DatabaseModule { }
