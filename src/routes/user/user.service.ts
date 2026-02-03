import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepo } from './user.repo';
import { CreateUserBodyType } from './user.model';
import { HasingService } from 'src/shared/services/hasing.service';
import { isPostgresUniqueError } from 'src/shared/helpers/error';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly hasingService: HasingService,
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
}
