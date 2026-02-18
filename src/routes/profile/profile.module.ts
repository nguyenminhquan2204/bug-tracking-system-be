import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserModule } from '../user/user.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [UserModule, FileModule],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}
