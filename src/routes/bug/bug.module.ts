import { Module } from '@nestjs/common';
import { BugController } from './bug.controller';
import { BugService } from './bug.service';
import { BugRepo } from './repos/bug.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bug } from 'src/database/entities/bug.entity';
import { BugHistory } from 'src/database/entities/bug_history.entity';
import { BugHistoryRepo } from './repos/bug-history.repo';

@Module({
  imports: [TypeOrmModule.forFeature([Bug, BugHistory])],
  controllers: [BugController],
  providers: [BugService, BugRepo, BugHistoryRepo]
})
export class BugModule {}
