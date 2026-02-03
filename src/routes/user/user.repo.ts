import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserBodyType } from './user.model';

@Injectable()
export class UserRepo {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(data: CreateUserBodyType) {
    const user = this.repository.create(data);
    return await this.repository.save(user);
  }
}
