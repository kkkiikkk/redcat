// Instruments
import { TransactionType } from './transaction.entity';

export interface ICreateTransaction {
  fromUser: string;
  toUser?: string;
  amount: number;
  transactionType: TransactionType;
}
