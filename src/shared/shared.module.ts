import { Module, Global } from '@nestjs/common';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { HasingService } from './services/hasing.service';
import { AccessTokenGuard } from './common/guards/access-token.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './common/guards/authentication.guard';
import { RoleModule } from 'src/routes/role/role.module';

const sharedServices = [HasingService, TokenService];
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
