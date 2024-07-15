// Core
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Config
import { serverConfig, dbConfig, authConfing } from './config';

// Modules
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './bus/Auth/auth.module';
import { UserModule } from './bus/User/user.module';
import { TransactionModule } from './bus/Transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [serverConfig, dbConfig, authConfing],
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
