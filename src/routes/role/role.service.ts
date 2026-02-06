import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { RoleRepo } from './role.repo';
import { CreateRoleBodyType, GetRolesBodyType } from './role.model';

@Injectable()
export class RoleService {
   constructor(private readonly roleRepo: RoleRepo) {}

   async createRole(data: CreateRoleBodyType) {
      const existingRoleName = await this.roleRepo.getDetailRoleByName(data.name);
      if(existingRoleName) throw new ConflictException('Role name is existing!')

      return await this.roleRepo.create(data);
   }

   async getRoleDetailById(id: number) {
      const existing = await this.roleRepo.getDetailRoleById(id);
      if(!existing) throw new BadRequestException('Role not found');

      return await this.roleRepo.getDetailRoleIncludePermission(id);
   }

   async list(query: GetRolesBodyType) {
      return await this.roleRepo.list(query);
   }

   async findRoleAuthById({ roleId, path, method }: { roleId: number, path: string, method: any }) {
      return await this.roleRepo.findRoleAuthById({ roleId, path, method });
   }
}
