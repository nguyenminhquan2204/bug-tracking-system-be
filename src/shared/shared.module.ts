import { Module, Global } from '@nestjs/common';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { HasingService } from './services/hasing.service';
import { S3Service } from './services/s3.service';
import { AccessTokenGuard } from './common/guards/access-token.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './common/guards/authentication.guard';
import { RoleModule } from 'src/routes/role/role.module';
import { EmailService } from './services/email.service';

const sharedServices = [HasingService, TokenService, S3Service, EmailService];
@Global()
@Module({
  exports: [...sharedServices, AccessTokenGuard],
  imports: [JwtModule, RoleModule],
  providers: [...sharedServices, AccessTokenGuard, {
    provide: APP_GUARD,
    useClass: AuthenticationGuard
  }],
})
export class SharedModule {}
