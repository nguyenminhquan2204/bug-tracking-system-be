import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "src/database/entities/permission.entity";
import { Repository } from "typeorm";
import { CreatePermissionBodyType, GetPermissionsQueryType, UpdatePermissionBodyType } from "./permission.model";
import { PermissionType } from "src/shared/models/share-permission.model";

@Injectable()
export class PermissionRepo {
   constructor(
      @InjectRepository(Permission)
      private readonly repository: Repository<Permission>
   ) {}

   async list(query: GetPermissionsQueryType) {
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

   async create(data: CreatePermissionBodyType): Promise<PermissionType> {
      return await this.repository.save(data);
   }

   async update(permissionId, data: UpdatePermissionBodyType): Promise<any> {
      await this.repository.update(permissionId, data);
      return { message: 'Update permission successfully!' } 
   }

   async getPermissionById(permissionId: number): Promise<PermissionType | null> {
      return this.repository.findOneBy({ id: permissionId });
   }

   async delete(permissionId: number, isHard?: boolean): Promise<any> {
      if(isHard) {
         await this.repository.delete(permissionId);
         return { message: 'Permission deleted permanently' }
      }
      await this.repository.softDelete(permissionId);
      return { message: 'Permission deleted successfully' };
   }
}