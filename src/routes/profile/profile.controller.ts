import { Controller, Get } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ActiveUser } from '../../shared/common/decorators/active-user.decorator';

@Controller('profile')
export class ProfileController {
   constructor(private readonly profileService: ProfileService) {}

   @Get()
   async getUserProfile(@ActiveUser('userId') userId: number) {
      return await this.profileService.getProfile(userId);
   }
}
