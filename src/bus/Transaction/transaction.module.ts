// Core
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { UserModule } from '../User/user.module';

// Instruments
import { Transaction } from './transaction.entity';
import { TranscationService } from './transaction.service';

// Controllers
import { TranscationController } from './transaction.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    forwardRef(() => UserModule),
  ],
  providers: [TranscationService],
  controllers: [TranscationController],
  exports: [TranscationService],
})
export class TransactionModule {}
