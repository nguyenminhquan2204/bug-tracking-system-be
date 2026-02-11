import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectRepo } from './project.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/database/entities/project.entity';
import { ProjectController } from './controlers/project.controller';
import { ProjectPublicController } from './controlers/project-public.controller';
import { ProjectMemberModule } from '../project-member/project-member.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), ProjectMemberModule],
  controllers: [ProjectController, ProjectPublicController],
  providers: [ProjectService, ProjectRepo]
})
export class ProjectModule {}
