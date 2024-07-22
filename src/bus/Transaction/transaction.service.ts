// Core
import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

// Entities
import { Transaction, TransactionType } from './transaction.entity';
import { User } from '../User/user.entity';

// Instruments
import { ICreateTransaction } from './transaction.interfaces';
import { UserService } from '../User/user.service';
import {
  CreateTransactionDto,
  CreateTransferTransactionDto,
} from './dtos/createTransaction.dto';
import { GetTransactionsQueryDto } from './dtos/getTransactionsQuery.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @Inject(UserService)
    private readonly userService: UserService,
    private readonly dataSource: DataSource, // Inject DataSource
  ) {}

  createOne(payload: ICreateTransaction): Promise<Transaction> {
    return this.transactionRepository.save(payload);
  }

  findOneById(id: string): Promise<Transaction> {
    return this.transactionRepository.findOneBy({ id });
  }

  async findAll(query?: GetTransactionsQueryDto | null) {
    const { page = 1, take = 10 } = query || {};
    const transactions = await this.transactionRepository.find({
      take,
      skip: (page - 1) * take,
    });

    const count = await this.transactionRepository.count();

    return { transactions, count };
  }

  findById(id: string): Promise<Transaction[]> {
    return this.transactionRepository.find({ where: { fromUser: id } });
  }

  findUserTransactionById(
    transactionId: string,
    userId: string,
  ): Promise<Transaction> {
    return this.transactionRepository.findOne({
      where: { fromUser: userId, id: transactionId },
    });
  }

  updateOne(newTransaction: Transaction) {
    return this.transactionRepository.save({
      ...newTransaction,
    });
  }

  async transfer(payload: CreateTransferTransactionDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sender = await this.userService.findOneById(userId);
      const receiver = await this.userService.findOneById(payload.toUser);

      if (sender.amount < payload.amount) {
        throw new BadRequestException('Not enough money');
      }

      if (!receiver) {
        throw new NotFoundException('User does not exist');
      }

      if (receiver.isBlocked) {
        throw new ConflictException('Cant perform transaction with that user');
      }

      const newTransaction = queryRunner.manager.create(Transaction, {
        fromUser: userId,
        transactionType: TransactionType.Transfer,
        amount: payload.amount,
        toUser: payload.toUser,
      });

      sender.amount -= payload.amount;
      receiver.amount += payload.amount;
      await queryRunner.manager.save(sender);
      await queryRunner.manager.save(receiver);

      const savedTransaction = await queryRunner.manager.save(newTransaction);
      await queryRunner.commitTransaction();
      return savedTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deposit(payload: CreateTransactionDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userService.findOneById(userId);

      const newTransaction = queryRunner.manager.create(Transaction, {
        fromUser: userId,
        transactionType: TransactionType.Deposit,
        amount: payload.amount,
      });

      user.amount += payload.amount;
      await queryRunner.manager.save(user);

      const savedTransaction = await queryRunner.manager.save(newTransaction);
      await queryRunner.commitTransaction();
      return savedTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async withdraw(payload: CreateTransactionDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userService.findOneById(userId);

      if (user.amount < payload.amount) {
        throw new BadRequestException('Not enough money');
      }

      const newTransaction = queryRunner.manager.create(Transaction, {
        fromUser: userId,
        transactionType: TransactionType.Withdraw,
        amount: payload.amount,
      });

      user.amount -= payload.amount;
      await queryRunner.manager.save(user);

      const savedTransaction = await queryRunner.manager.save(newTransaction);
      await queryRunner.commitTransaction();
      return savedTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelTransaction(transactionId: string, userId: string | null = null) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = userId
        ? await queryRunner.manager.findOne(Transaction, {
            where: { id: transactionId, fromUser: userId },
          })
        : await queryRunner.manager.findOne(Transaction, {
            where: { id: transactionId },
          });

      if (!transaction) {
        throw new NotFoundException('Transaction with such id does not exist');
      }

      const transactionCreator = await queryRunner.manager.findOne(User, {
        where: { id: transaction.fromUser },
      });

      if (!transactionCreator) {
        throw new NotFoundException('Creator of transaction does not exist');
      }

      if (transactionCreator.isBlocked) {
        throw new BadRequestException('Creator of transaction is blocked');
      }

      if (transaction.transactionType === TransactionType.Transfer) {
        const receiver = await queryRunner.manager.findOne(User, {
          where: { id: transaction.toUser },
        });

        if (!receiver) {
          throw new NotFoundException('Receiver of transaction does not exist');
        }

        if (receiver.isBlocked) {
          throw new BadRequestException('Receiver of transaction is blocked');
        }

        transactionCreator.amount += transaction.amount;
        receiver.amount -= transaction.amount;
        await queryRunner.manager.save(transactionCreator);
        await queryRunner.manager.save(receiver);
      } else {
        transactionCreator.amount += transaction.amount;
        await queryRunner.manager.save(transactionCreator);
      }

      await queryRunner.manager.delete(Transaction, { id: transactionId });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
