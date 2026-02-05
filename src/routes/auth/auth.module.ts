import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthRepo } from './auth.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/database/entities/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Token]), UserModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepo]
})
export class AuthModule {}
