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
import { PermissionModule } from './routes/permission/permission.module';
import { ProfileModule } from './routes/profile/profile.module';
import { ProjectMemberModule } from './routes/project-member/project-member.module';
import { FileModule } from './routes/file/file.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerBehindProxyGuard } from './shared/common/guards/throller-behind-proxy.guard';
import { WebsocketModule } from './websockets/websocket.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60 * 1000,
          limit: 30
        }
      ]
    }),
    WebsocketModule,
    DatabaseModule, 
    SharedModule, 
    UserModule, 
    RoleModule, 
    ProjectModule, 
    BugModule, 
    AuthModule, 
    PermissionModule, 
    ProfileModule, 
    ProjectMemberModule, 
    FileModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard
    },
  ],
})
export class AppModule {}
