import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserBodyType, GetDetailUserResType, GetUsersQueryType, GetUsersResType, UpdateUserBodyType } from './user.model';
import { UserNotFound } from './user.error';

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

  async list(pagination: GetUsersQueryType): Promise<GetUsersResType> {
    const skip = (pagination.page - 1) * pagination.limit;
    const take = pagination.limit;

    const [items, total] = await this.repository.findAndCount({
      skip,
      take,
      order: { createdAt: 'DESC' }
    });

    return {
      data: items,
      totalItems: total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit)
    }
  }

  async update(userId: number, payload: UpdateUserBodyType){
    const user = await this.repository.preload({
      id: userId,
      ...payload
    });

    if(!user) throw UserNotFound;

    await this.repository.save(user);

    return { message: 'Update user successfully!' }
  }

  async getUserById(userId: number): Promise<User> {
    const user = await this.repository.findOneBy({ id: userId });
    
    if(!user) throw UserNotFound;

    return user;
  }

  async deleteById(userId: number, isHard?: boolean) {
    const user = await this.repository.findOneBy({ id: userId });
    
    if(!user) throw UserNotFound;

    return isHard ? this.repository.delete({ id: userId }) : this.repository.softDelete({ id: userId });
  }
}
