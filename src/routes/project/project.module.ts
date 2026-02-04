import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectRepo } from './project.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/database/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepo]
})
export class ProjectModule {}
