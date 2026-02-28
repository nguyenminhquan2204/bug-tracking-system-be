import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepo } from './user.repo';
import { CreateUserBodyType, GetUsersQueryType, UpdateUserBodyType } from './user.model';
import { HasingService } from 'src/shared/services/hasing.service';
import { isPostgresUniqueError } from 'src/shared/helpers/error';
import { RoleService } from '../role/role.service';
import { UpdateProfileType } from '../profile/profile.model';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly hasingService: HasingService,
    private readonly roleService: RoleService
  ) {}

  async create(data: CreateUserBodyType) {
    try {
      const passwordHash = await this.hasingService.hash(data.password);
      return await this.userRepo.create({
        ...data,
        password: passwordHash,
      });
    } catch (error) {
      if (isPostgresUniqueError(error)) {
        throw new ConflictException('Email already exists');
      }

      throw error;
    }
  }

  async listAdmin() {
    const roleAdminId = await this.roleService.getIdRoleAdmin();
    if(roleAdminId == null) return;
    return await this.userRepo.listUserWithRoleId(roleAdminId);
  }

  async listTester() {
    const roleTesterId = await this.roleService.getIdRoleTester();
    if(roleTesterId == null) return;
    return await this.userRepo.listUserWithRoleId(roleTesterId);
  }

  async listDeveloper() {
    const roleDeveloperId = await this.roleService.getIdRoleDeveloper();
    if(roleDeveloperId == null) return;
    return await this.userRepo.listUserWithRoleId(roleDeveloperId);
  }

  async list(pagination: GetUsersQueryType) {
    return await this.userRepo.list(pagination);
  }

  async update(userId: number, payload: UpdateUserBodyType) {
    return await this.userRepo.update(userId, payload);
  }

  async updateProfile(userId: number, payload: UpdateProfileType) {
    return await this.userRepo.update(userId, payload);
  }

  async getUserById(userId: number) {
    return await this.userRepo.getUserById(userId);
  }

  async deleteById(userId: number) {
    return await this.userRepo.deleteById(userId);
  }

  async getInfoUserByEmailIncludeRole(email: string) {
    return await this.userRepo.getInfoUserByEmailIncludeRole(email);
  }

  async getUsersForChatAdmin(userId: number) {
    return await this.userRepo.getUsersForChatAdmin(userId);
  }

  async getAdminsChat() {
    const roleAdminId = await this.roleService.getIdRoleAdmin();
    if(roleAdminId == null) return;
    return await this.userRepo.getAdminsChat(roleAdminId);
  }
}
