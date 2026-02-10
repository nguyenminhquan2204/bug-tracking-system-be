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
}
