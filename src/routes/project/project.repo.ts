import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "src/database/entities/project.entity";
import { Repository } from "typeorm";
import { CreateProjectBodyType, GetProjectsQueryBodyType, ProjectType, UpdateProjectBodyType } from "./project.model";

@Injectable()
export class ProjectRepo {
   constructor(
      @InjectRepository(Project)
      private readonly repository: Repository<Project>
   ) {}

   async list(query: GetProjectsQueryBodyType) {
      const { limit, page } = query;
      const skip = (page - 1) * limit;
      const take = limit;

      const [items, total] = await this.repository.findAndCount({
         skip,
         take,
         order: { createdAt: 'DESC' }
      });

      return {
         data: items,
         totalItems: total,
         page: page,
         limit: limit,
         totalPages: Math.ceil(total / limit)
      }
   }

   async getProjectById(projectId: number): Promise<ProjectType | null> {
      return await this.repository.findOneBy({ id: projectId })
   }

   async create(body: CreateProjectBodyType): Promise<ProjectType> {
      return await this.repository.save(body);
   }

   async update(projectId: number, body: UpdateProjectBodyType): Promise<any> {
      await this.repository.update(projectId, body);
      return { message: 'Update project successfully!' }
   }

   async delete(projectId: number, isHard?: boolean): Promise<any> {
      if(isHard) {
         await this.repository.delete(projectId);
         return { message: 'Project deleted permanently' }
      }
      await this.repository.softDelete(projectId);
      return { message: 'Project deleted successfully' };
   }
}