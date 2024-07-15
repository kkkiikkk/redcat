// Core
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entities
import { User, Roles } from '../../bus/User/user.entity';

@Injectable()
export class UserSeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    await this.createUsers();
  }

  private async createUsers() {
    const user = {
      name: 'Admin',
      email: 'admin@test.com',
      password: '$2b$10$ITKuOl9tsiNcGzpaZ0yfTea2rK.w9M4Y7jjj.bDBs7uoBfMIuWlh6', //122313
      role: Roles.Admin,
    };

    if (await this.userRepository.findOne({ where: { email: user.email } })) {
      return;
    }
    await this.userRepository.save(user);
  }
}
