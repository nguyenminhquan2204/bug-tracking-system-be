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
import { MessageService } from './services/message.service';
import { MessageRepo } from './repos/message.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/database/entities/mesage.entity';
import { NotificationService } from './services/notification.service';
import { NotificationRepo } from './repos/notification.repo';
import { Notification } from 'src/database/entities/notification.entity';
import { WebsocketModule } from 'src/websockets/websocket.module';

const sharedServices = [HasingService, TokenService, S3Service, EmailService, MessageService, MessageRepo, NotificationService, NotificationRepo];
@Global()
@Module({
  exports: [...sharedServices, AccessTokenGuard],
  imports: [TypeOrmModule.forFeature([Message, Notification]), JwtModule, RoleModule],
  providers: [...sharedServices, AccessTokenGuard, {
    provide: APP_GUARD,
    useClass: AuthenticationGuard
  }],
})
export class SharedModule {}
