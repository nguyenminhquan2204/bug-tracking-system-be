import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectRepo } from './project.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/database/entities/project.entity';
import { ProjectController } from './controlers/project.controller';
import { ProjectPublicController } from './controlers/project-public.controller';
import { ProjectMemberModule } from '../project-member/project-member.module';
import { BugModule } from '../bug/bug.module';
import { ChatRepo } from './repos/chat.repo';
import { Conversation } from 'src/database/entities/conversation.entity';
import { ConversationParticipant } from 'src/database/entities/conversation-participant.entity';
import { ChatService } from './services/chat.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Conversation, ConversationParticipant]), ProjectMemberModule, BugModule, UserModule],
  controllers: [ProjectController, ProjectPublicController],
  providers: [ProjectService, ProjectRepo, ChatService, ChatRepo]
})
export class ProjectModule {}
