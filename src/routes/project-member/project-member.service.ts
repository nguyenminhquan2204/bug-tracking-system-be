import { Injectable } from '@nestjs/common';
import { ProjectMemberRepo } from './project-member.repo';
import { AddMembersType } from './project-member.model';

@Injectable()
export class ProjectMemberService {
   constructor(private readonly projectMemberRepo: ProjectMemberRepo) {}

   addMembers(projectId: number, members: AddMembersType) {
      return this.projectMemberRepo.addMembers(projectId, members);
   }

   members(projectId) {
      return this.projectMemberRepo.members(projectId)
   }

   deleteMember(projectId: number, userId: number) {
      return this.projectMemberRepo.deleteMember(projectId, userId);
   }

   restoreMember(projectId: number, userId: number) {
      return this.projectMemberRepo.restoreMember(projectId, userId);
   }

   getMyProject(userId: number) {
      return this.projectMemberRepo.getMyProject(userId);
   }

   getDevelopersInProject(projectId) {
      return this.projectMemberRepo.getDevelopersInProject(projectId);
   }

   validProjectWithUserId(userId: number, projectId: number) {
      return this.projectMemberRepo.findByUserIdAndProjectId(userId, projectId);
   }

   async getUsersChat(userId: number) {
      const projects = await this.getMyProject(userId);
      if(projects.length === 0) return [];
      const projectIds = projects.map((p) => p.projectId);

      return this.projectMemberRepo.getUsersChat(projectIds);
   }
}
