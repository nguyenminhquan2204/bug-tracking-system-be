import { Injectable } from '@nestjs/common';
import { PermissionRepo } from './permission.repo';
import { CreatePermissionBodyType, GetPermissionsQueryType, UpdatePermissionBodyType } from './permission.model';

@Injectable()
export class PermissionService {
   constructor(private readonly permissionRepo: PermissionRepo) {}

   list(query: GetPermissionsQueryType) {
      return this.permissionRepo.list(query);
   }

   getPermissionById(permissionId: number) {
      return this.permissionRepo.getPermissionById(permissionId);
   }

   create(body: CreatePermissionBodyType) {
      return this.permissionRepo.create(body);
   }

   update(permissionId: number, body: UpdatePermissionBodyType) {
      return this.permissionRepo.update(permissionId, body)
   }

   delete(permissionId: number) {
      return this.permissionRepo.delete(permissionId);
   }
}
