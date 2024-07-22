// Core
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { UserModule } from '../User/user.module';

// Instruments
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';

// Controllers
import { TranscationController } from './transaction.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    forwardRef(() => UserModule),
  ],
  providers: [TransactionService],
  controllers: [TranscationController],
  exports: [TransactionService],
})
export class TransactionModule {}
