// Core
import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entities
import { Transaction, TransactionType } from './transaction.entity';

// Instruments
import { ICreateTransaction } from './transaction.interfaces';
import { UserService } from '../User/user.service';
import {
  CreateTransactionDto,
  CreateTransferTransactionDto,
} from './dtos/createTransaction.dto';
import { GetTransactionsQueryDto } from './dtos/getTransactionsQuery.dto';

@Injectable()
export class TranscationService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @Inject(UserService)
    private readonly userSevice: UserService,
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
    const sender = await this.userSevice.findOneById(userId);
    const reciever = await this.userSevice.findOneById(payload.toUser);

    if (sender.amount < payload.amount) {
      throw new BadRequestException('Not enough money');
    }

    if (!reciever) {
      throw new NotFoundException('User does not exist');
    }

    if (reciever.isBlocked) {
      throw new ConflictException('Cant perfom transactin with that user');
    }

    const newTransaction = await this.createOne({
      fromUser: userId,
      transactionType: TransactionType.Transfer,
      amount: payload.amount,
      toUser: payload.toUser,
    });

    sender.amount -= payload.amount;
    reciever.amount += payload.amount;
    await this.userSevice.updateOne(sender);
    await this.userSevice.updateOne(reciever);

    return newTransaction;
  }

  async deposit(payload: CreateTransactionDto, userId: string) {
    const user = await this.userSevice.findOneById(userId);

    const newTransaction = await this.createOne({
      fromUser: userId,
      transactionType: TransactionType.Deposit,
      amount: payload.amount,
    });

    user.amount += payload.amount;
    await this.userSevice.updateOne(user);

    return newTransaction;
  }

  async withdraw(payload: CreateTransactionDto, userId: string) {
    const user = await this.userSevice.findOneById(userId);

    if (user.amount < payload.amount) {
      throw new BadRequestException('Not enough money');
    }

    const newTransaction = await this.createOne({
      fromUser: userId,
      transactionType: TransactionType.Withdraw,
      amount: payload.amount,
    });

    user.amount -= payload.amount;
    await this.userSevice.updateOne(user);

    return newTransaction;
  }

  async cancelTransaction(transactionId: string, userId: string | null = null) {
    let reciever = null;
    const transaction = userId
      ? await this.findOneById(transactionId)
      : await this.findUserTransactionById(transactionId, userId);

    if (!transaction) {
      throw new NotFoundException('Transaction with such id does not exist');
    }

    const transactionCreator = await this.userSevice.findOneById(
      transaction.fromUser,
    );

    if (!transactionCreator) {
      throw new NotFoundException('Creator of transaction does not exists');
    }

    if (transactionCreator.isBlocked) {
      throw new BadRequestException('Creator of transaction is blocked');
    }
    if (transaction.transactionType === TransactionType.Transfer) {
      reciever = await this.userSevice.findOneById(transaction.toUser);

      if (!reciever) {
        throw new NotFoundException('Reciever of transaction does not exists');
      }

      if (reciever.isBlocked) {
        throw new BadRequestException('Reciever of transaction is blocked');
      }
    }

    switch (transaction.transactionType) {
      case TransactionType.Withdraw:
        transactionCreator.amount += transaction.amount;
        await this.userSevice.updateOne(transactionCreator);
        break;
      case TransactionType.Deposit:
        transactionCreator.amount += transaction.amount;
        await this.userSevice.updateOne(transactionCreator);
        break;
      case TransactionType.Transfer:
        transactionCreator.amount += transaction.amount;
        reciever.amount -= transaction.amount;
        await this.userSevice.updateOne(transactionCreator);
        await this.userSevice.updateOne(reciever);
        break;
    }

    await this.transactionRepository.delete({ id: transactionId });
  }
}
