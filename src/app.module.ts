import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './routes/user/user.module';
import { SharedModule } from './shared/shared.module';
import { RoleModule } from './routes/role/role.module';
import { ProjectModule } from './routes/project/project.module';
import { BugModule } from './routes/bug/bug.module';
import { AuthModule } from './routes/auth/auth.module';

@Module({
  imports: [DatabaseModule, SharedModule, UserModule, RoleModule, ProjectModule, BugModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
