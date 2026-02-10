import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class ProfileService {
   constructor(
      private readonly userService: UserService
   ) {}

   async getProfile(userId: number) {
      const user = await this.userService.getUserById(userId);
      if(!user) throw new NotFoundException('User not found');

      return user;
   }
}
