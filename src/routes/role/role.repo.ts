import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/database/entities/role.entity";
import { Repository } from "typeorm";
import { CreateRoleBodyType, GetRolesBodyType, GetRolesResType } from "./role.model";

@Injectable()
export class RoleRepo {
   constructor(
      @InjectRepository(Role)
      private readonly repository: Repository<Role>
   ) {}

   async list(pagination: GetRolesBodyType): Promise<GetRolesResType> {
      const skip = (pagination.page - 1) * pagination.limit;
      const take = pagination.limit;

      const [items, total] = await this.repository.findAndCount({
         skip,
         take,
         order: { createdAt: 'DESC' }
      });

      return {
         data: items,
         totalItems: total,
         page: pagination.page,
         limit: pagination.limit,
         totalPages: Math.ceil(total / pagination.limit)
      }
   }

   async create(data: CreateRoleBodyType) {
      return await this.repository.save(data);
   }

   async getDetailRoleByName(name: string) {
      return await this.repository.findOne({
         where: { name: name }
      })
   }
}