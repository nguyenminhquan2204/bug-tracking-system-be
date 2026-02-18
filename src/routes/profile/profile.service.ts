import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { FileService } from '../file/file.service';
import { DEFAULT_SUCCESS_MESSAGE, HttpStatus, SuccessResponse } from 'src/shared/helpers/response';
import { UpdateProfileType } from './profile.model';

@Injectable()
export class ProfileService {
   constructor(
      private readonly userService: UserService,
      private readonly fileService: FileService
   ) {}


   async getProfile(userId: number) {
      const user = await this.userService.getUserById(userId);
      if(!user) throw new NotFoundException('User not found');

      return user;
   }

   async changeAvatar(userId: number, file: Express.Multer.File) {
      return await this.fileService.uploadFileFromFormData(file, true);
   }

   async updateProfile(userId: number, data: UpdateProfileType) {
      return await this.userService.updateProfile(userId, data);
   }
}
