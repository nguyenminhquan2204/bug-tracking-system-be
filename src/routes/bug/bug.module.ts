import { Module } from '@nestjs/common';
import { BugController } from './bug.controller';
import { BugService } from './bug.service';
import { BugRepo } from './repos/bug.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bug } from 'src/database/entities/bug.entity';
import { BugHistory } from 'src/database/entities/bug_history.entity';
import { BugHistoryRepo } from './repos/bug-history.repo';
import { BugComment } from 'src/database/entities/bug_comment.entity';
import { BugCommentRepo } from './repos/bug-comment.repo';
import { BugAttachment } from 'src/database/entities/bug_attactment.entity';
import { BugAttachmentRepo } from './repos/bug-attachment.repo';
import { FileModule } from '../file/file.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bug, BugHistory, BugComment, BugAttachment]), FileModule, UserModule],
  controllers: [BugController],
  providers: [BugService, BugRepo, BugHistoryRepo, BugCommentRepo, BugAttachmentRepo],
  exports: [BugService]
})
export class BugModule {}
