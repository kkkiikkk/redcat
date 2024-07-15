// Core
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entities
import { User } from './user.entity';

// Dtos
import { UserRegisterDto } from '../Auth/dtos/userRegister.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  createOne(payload: UserRegisterDto): Promise<User> {
    return this.userRepository.save(payload);
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  findOneById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  updateOne(newUser: User) {
    return this.userRepository.save({
      ...newUser,
    });
  }
}
