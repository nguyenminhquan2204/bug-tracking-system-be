import { Module } from '@nestjs/common';
import { BugController } from './bug.controller';
import { BugService } from './bug.service';
import { BugRepo } from './repos/bug.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bug } from 'src/database/entities/bug.entity';
import { BugHistory } from 'src/database/entities/bug_history.entity';
import { BugHistoryRepo } from './repos/bug-history.repo';
import { BugAssignment } from 'src/database/entities/bug_assignment.entity';
import { BugAssignRepo } from './repos/bug-assign.repo';

@Module({
  imports: [TypeOrmModule.forFeature([Bug, BugHistory, BugAssignment])],
  controllers: [BugController],
  providers: [BugService, BugRepo, BugHistoryRepo, BugAssignRepo]
})
export class BugModule {}
