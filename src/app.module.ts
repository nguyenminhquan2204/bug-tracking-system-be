import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './routes/user/user.module';
import { SharedModule } from './shared/shared.module';
import { RoleModule } from './routes/role/role.module';

@Module({
  imports: [DatabaseModule, SharedModule, UserModule, RoleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
