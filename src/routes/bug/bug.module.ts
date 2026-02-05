import { Module } from '@nestjs/common';
import { BugController } from './bug.controller';
import { BugService } from './bug.service';
import { BugRepo } from './bug.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bug } from 'src/database/entities/bug.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bug])],
  controllers: [BugController],
  providers: [BugService, BugRepo]
})
export class BugModule {}
