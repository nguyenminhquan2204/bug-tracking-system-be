import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { CreateUserBodyType, GetUsersQueryType, GetUsersResType, UpdateUserBodyType } from './user.model';
import { UserNotFound } from './user.error';
import { UserType } from 'src/shared/models/share-user.model';

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

  async listUserWithRoleId(roleId: number) {
    const data = await this.repository.find({
      where: { roleId: roleId },
      relations: {
        role: true
      }
    });
    return { items: data }
  }

  async list(pagination: GetUsersQueryType): Promise<GetUsersResType> {
    const skip = (pagination.page - 1) * pagination.limit;
    const take = pagination.limit;
    const userName = pagination.userName;
    const roleId = pagination.roleId;

    const where: any = {};

    if (userName) where.userName = ILike(`%${userName}%`);

    if (roleId) where.roleId = roleId;

    const [items, total] = await this.repository.findAndCount({
      where,
      relations: {
        role: true
      },
      skip,
      take,
      order: { createdAt: 'DESC' }
    });

    return {
      items: items,
      totalItems: total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit)
    }
  }

  async update(userId: number, payload: any){
    const user = await this.repository.preload({
      id: userId,
      ...payload
    });

    if(!user) throw UserNotFound;

    await this.repository.save(user);

    return { message: 'Update user successfully!' }
  }

  async getUserById(userId: number): Promise<User> {
    const user = await this.repository.findOne({
      where: { id: userId },
      relations: { avatar: true }
    });
    
    if(!user) throw UserNotFound;

    return user;
  }

  async deleteById(userId: number, isHard?: boolean) {
    const user = await this.repository.findOneBy({ id: userId });
    
    if(!user) throw UserNotFound;

    return isHard ? this.repository.delete({ id: userId }) : this.repository.softDelete({ id: userId });
  }

  async getInfoUserByEmailIncludeRole(email: string): Promise<UserType | null> {
    return await this.repository.findOne({
      where: { email: email },
      relations: {
        role: true
      }
    })
  }

  async getAdminsChat(roleAdminId: number) {
    return await this.repository
      .createQueryBuilder('user')
      .select([
        'user.id AS id',
        'user.userName AS username',
        'user.email AS email'
      ])
      .where('user.roleId = :roleAdminId', { roleAdminId })
      .getRawMany();
  }

  async getUsersForChatAdmin(userId: number) {
    const users = await this.repository
      .createQueryBuilder('user')
      .leftJoin('user.role', 'role')
      .where('user.id != :userId', { userId })
      .select([
        'user.id as id', 
        'user.userName as username', 
        'user.email as email', 
        'role.name as rolename'
      ])
      .getRawMany();

    return users.reduce((acc, user) => {
      if(!acc[user.rolename]) acc[user.rolename] = [];
      acc[user.rolename].push(user);
      return acc;
    }, {} as Record<string, any>);
  }
}
