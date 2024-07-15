// Core
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

export enum Roles {
  Admin = 'admin',
  Client = 'client',
}

export const USER_DEFAULT_GROUP = 'user_default_group';
export const USER_DETAIL_GROUP = '';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Expose({ groups: [USER_DEFAULT_GROUP, USER_DETAIL_GROUP] })
  id: string;

  @Column('text', { unique: true })
  @Expose({ groups: [USER_DEFAULT_GROUP, USER_DETAIL_GROUP] })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Expose({ groups: [USER_DEFAULT_GROUP, USER_DETAIL_GROUP] })
  name: string;

  @Column({ nullable: true, default: 0 })
  @Expose({ groups: [USER_DETAIL_GROUP] })
  amount: number;

  @Column({ type: 'enum', enum: Roles, default: Roles.Client })
  @Exclude()
  role: Roles;

  @Column({ default: false })
  @Exclude()
  isBlocked: boolean;
}
