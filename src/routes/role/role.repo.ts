import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/database/entities/role.entity";
import { IsNull, Repository } from "typeorm";
import { CreateRoleBodyType, GetRolesBodyType, GetRolesResType } from "./role.model";
import { GetRoleDetailIncludePermissionType } from "src/shared/models/share-role.model";

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

   async getDetailRoleById(id: number) {
      return await this.repository.findOne({
         where: { id: id }
      })
   }

   async getDetailRoleIncludePermission(id: number): Promise<GetRoleDetailIncludePermissionType | null> {
      return await this.repository.findOne({
         where: {
            id: id
         },
         relations: {
            permissions: true
         }
      })
   }

   async create(data: CreateRoleBodyType) {
      return await this.repository.save(data);
   }

   async getDetailRoleByName(name: string) {
      return await this.repository.findOne({
         where: { name: name }
      })
   }

   async findRoleAuthById({ roleId, path, method }: { roleId: number, path: string, method: any }) {
      return await this.repository
         .createQueryBuilder('role')
         .leftJoinAndSelect(
            'role.permissions',
            'permission',
            'permission.deletedAt IS NULL AND permission.path = :path AND permission.method = :method',
            { path, method }
         )
         .where('role.id = :roleId', { roleId })
         .andWhere('role.deletedAt IS NULL')
         .getOne()

   }
}