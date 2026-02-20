import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepo } from './project.repo';
import { CreateProjectBodyType, GetProjectsQueryBodyType, UpdateProjectBodyType } from './project.model';
import { ProjectMemberService } from '../project-member/project-member.service';
import { BugService } from '../bug/bug.service';

@Injectable()
export class ProjectService {
   constructor(
      private readonly projectRepo: ProjectRepo,
      private readonly projectMemberService: ProjectMemberService,
      private readonly bugService: BugService
   ) {}


   list(query: GetProjectsQueryBodyType) {
      return this.projectRepo.list(query);
   }

   getAllProject() {
      return this.projectRepo.getAllProject();
   }

   async getDashboardAdmin(projectId: number) {
      let data;
      if(projectId === 0) {
         data = await this.bugService.getDashboardAdminAll()
      } else {

      }
      return data;
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

   getMyProject(userId) {
      return this.projectMemberService.getMyProject(userId);
   }

   async getDevelopersInProject(projectId: number) {
      await this.getProjectById(projectId);
      return await this.projectMemberService.getDevelopersInProject(projectId);
   }
}
