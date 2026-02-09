import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepo } from './project.repo';
import { CreateProjectBodyType, GetProjectsQueryBodyType, UpdateProjectBodyType } from './project.model';

@Injectable()
export class ProjectService {
   constructor(private readonly projectRepo: ProjectRepo) {}


   list(query: GetProjectsQueryBodyType) {
      return this.projectRepo.list(query);
   }

   async getProjectById(projectId: number) {
      const project = await this.projectRepo.getProjectById(projectId);
      if(!project) throw new NotFoundException('Project not found');
      return project;
   }

   create(body: CreateProjectBodyType) {
      return this.projectRepo.create(body);
   }

   async update(projectId: number, body: UpdateProjectBodyType) {
      const existing = await this.projectRepo.getProjectById(projectId);
      if(!existing) throw new NotFoundException('Project not found');

      return await this.projectRepo.update(projectId, body);
   }

   async delete(projectId: number) {
      const existing = await this.projectRepo.getProjectById(projectId);
      if(!existing) throw new NotFoundException('Project not found');

      return await this.projectRepo.delete(projectId);
   }
}
