import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProjectMember } from "src/database/entities/project_member.entity";
import { Repository } from "typeorm";
import { AddMembersType } from "./project-member.model";

@Injectable()
export class ProjectMemberRepo {
   constructor(
      @InjectRepository(ProjectMember)
      private readonly repository: Repository<ProjectMember>
   ) {}

   async addMembers(projectId: number, members: AddMembersType) {
      const data = members.map((m) => ({
         userId: m.id,
         projectId,
         role: m.role,
      }));

      return this.repository
         .createQueryBuilder()
         .insert()
         .into(ProjectMember)
         .values(data)
         .orUpdate(['role', 'deletedAt'], ['userId', 'projectId'])
         .execute();
   }

   async members(projectId) {
      const testers$ = this.repository.find({
         where: { 
            projectId: projectId,
            role: 'Tester'
         },
         relations: {
            user: true,
         }
      })
      const developers$ = this.repository.find({
         where: { 
            projectId: projectId,
            role: 'Developer'
         },
         relations: {
            user: true,
         }
      })

      const [testers, developers] = await Promise.all([testers$, developers$]);

      return { testers, developers }
   }

   async deleteMember(projectId: number, userId: number, isHard?: boolean) {
      const exist = await this.repository.findOne({
         where: { 
            userId: userId,
            projectId: projectId
         }
      })
      if(!exist) throw new NotFoundException('User in project not found');

      if(isHard) {
         await this.repository.delete({ projectId, userId }); 
      } else {
         await this.repository.softDelete({ projectId, userId });
      }

      return { message: 'Delete member in project successfully.' }
   }

   async restoreMember(projectId: number, userId: number) {
      const result = await this.repository.restore({ projectId, userId });

      if (!result.affected) {
         throw new NotFoundException('Member not found');
      }

      return { message: 'Restore member successfully.' };
   }

   async getMyProject(userId: number) {
      return await this.repository.find({
         where: { userId: userId },
         relations: {
            project: {
               managerUserInfo: true
            }
         }
      })
   }

   async getDevelopersInProject(projectId: number) {
      return await this.repository.find({
         where: { 
            projectId: projectId,
            role: 'Developer'
         },
         relations: {
            user: true
         }
      })
   }

   async findByUserIdAndProjectId(userId: number, projectId: number) {
      return await this.repository.find({
         where: {
            userId: userId,
            projectId: projectId
         }
      })
   }
}