import { Body, Controller, Get, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ActiveUser } from '../../shared/common/decorators/active-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { DEFAULT_SUCCESS_MESSAGE, HttpStatus, SuccessResponse } from 'src/shared/helpers/response';
import { UpdateProfileDTO } from './profile.dto';

@Controller('profile')
export class ProfileController {
   constructor(private readonly profileService: ProfileService) {}

   @Get()
   async getUserProfile(@ActiveUser('userId') userId: number) {
      return await this.profileService.getProfile(userId);
   }

   @Post('change-avatar')
   @UseInterceptors(FileInterceptor('file'))
   async changeAvatar(@ActiveUser('userId') userId: number, @UploadedFile() file: Express.Multer.File) {
      const response = await this.profileService.changeAvatar(userId, file);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Patch()
   async updateProfile(@ActiveUser('userId') userId: number, @Body() data: UpdateProfileDTO) {
      const response = await this.profileService.updateProfile(userId, data);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }
}
