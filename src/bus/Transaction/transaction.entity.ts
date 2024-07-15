// Core
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { Expose } from 'class-transformer';

export enum TransactionType {
  Deposit = 'deposit',
  Withdraw = 'withdraw',
  Transfer = 'transfer',
}

export const TRANSACTION_DEFAULT_GROUP = 'transaction_default_group';
export const TRANSCATION_DETAIL_GROUP = 'transcaction_detail_group';
@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Expose({ groups: [TRANSACTION_DEFAULT_GROUP, TRANSCATION_DETAIL_GROUP] })
  id: string;

  @Column({ nullable: true, default: 0 })
  @Expose({ groups: [TRANSACTION_DEFAULT_GROUP, TRANSCATION_DETAIL_GROUP] })
  amount: number;

  @Column()
  @Expose({ groups: [TRANSCATION_DETAIL_GROUP] })
  fromUser: string;

  @Column({ nullable: true })
  @Expose({ groups: [TRANSCATION_DETAIL_GROUP] })
  toUser: string;

  @Column({ type: 'enum', enum: TransactionType, nullable: false })
  @Expose({ groups: [TRANSACTION_DEFAULT_GROUP, TRANSCATION_DETAIL_GROUP] })
  transactionType: TransactionType;
}
