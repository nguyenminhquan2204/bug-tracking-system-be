import { Module, Global } from '@nestjs/common';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { HasingService } from './services/hasing.service';

const sharedServices = [HasingService, TokenService];
@Global()
@Module({
  exports: [...sharedServices],
  imports: [JwtModule],
  providers: [...sharedServices],
})
export class SharedModule {}
