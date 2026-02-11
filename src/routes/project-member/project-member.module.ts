import { Module } from '@nestjs/common';
import { ProjectMemberController } from './project-member.controller';
import { ProjectMemberService } from './project-member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMember } from 'src/database/entities/project_member.entity';
import { ProjectMemberRepo } from './project-member.repo';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectMember])],
  controllers: [ProjectMemberController],
  providers: [ProjectMemberService, ProjectMemberRepo],
  exports: [ProjectMemberService]
})
export class ProjectMemberModule {}
