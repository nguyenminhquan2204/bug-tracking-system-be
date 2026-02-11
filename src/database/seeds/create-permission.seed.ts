import { In, IsNull } from "typeorm";
import { dataSource } from "../data-source";
import { Permission } from "../entities/permission.entity";
import { Role } from "../entities/role.entity";
import { HttpMethod } from "src/shared/constants/other.constant";
import { AppModule } from "src/app.module";
import { NestFactory } from "@nestjs/core";

const TesterModule = [
   'PROJECT-PUBLIC',
   'BUG',
   'PROFILE'
]

export async function seedCreatePermission() {
   const app = await NestFactory.create(AppModule);
   // await app.listen(envConfig.PORT);
   await app.listen(8000);
   const server = app.getHttpAdapter().getInstance();
   const router = server.router;

   const roleRepo = dataSource.getRepository(Role);
   const permissionRepo = dataSource.getRepository(Permission);

   // const permissionInDb = await permissionRepo.find({ where: { deletedAt: IsNull() }});
   const permissionInDb = await permissionRepo.find();
   const availableRoutes: {path: string, method: keyof typeof HttpMethod, name: string, module: string}[] = router.stack
      .map((layer) => {
         if(layer.route) {
            const path = layer.route?.path;
            const method = String(layer.route?.stack[0].method).toUpperCase() as keyof typeof HttpMethod;
            const module = path.split('/')[1].toUpperCase();
            return { path, method, name: method + ' ' + path, module }
         }
      })
      .filter((item) => item !== undefined)

   const permissionInDbMap = permissionInDb.reduce((acc, item) => {
      acc[`${item.method}-${item.path}`] = item;
      return acc
   }, {})
   const availableRoutesMap = availableRoutes.reduce((acc, item) => {
      acc[`${item.method}-${item.path}`] = item;
      return acc;
   }, {})

   const permissionsToDelele = permissionInDb.filter((item) => {
      return !availableRoutesMap[`${item.method}-${item.path}`]
   })
   // Xóa permission không tồn tại trong availableRoutes
   if(permissionsToDelele.length > 0) {
      const deleteResult = await permissionRepo.softDelete({
         id: In(permissionsToDelele.map(item => item.id))
      })
      console.log('Deleted permissions:', deleteResult.affected);
   } else {
      console.log('No permissions to delete');
   }

   const routesToAddRaw = availableRoutes.filter((item) => {
      return !permissionInDbMap[`${item.method}-${item.path}`]
   })
   const routesToAdd: {
      path: string;
      method: HttpMethod;
      name: string;
      module: string;
   }[] = routesToAddRaw.map(route => ({
      path: route.path,
      method: HttpMethod[route.method], // 🔥 FIX ENUM Ở ĐÂY
      name: route.name,
      module: route.module,
   }));
   if (routesToAdd.length > 0) {
      const result = await permissionRepo
         .createQueryBuilder()
         .insert()
         .into(Permission)
         .values(routesToAdd)
         .orIgnore() // skip duplicates
         .execute();

      console.log('Added permissions:', result.identifiers.length);
   } else {
      console.log('No permissions to add');
   }

   const updatedPermissionsInDb = await permissionRepo.find();

   const adminPermissionIds = updatedPermissionsInDb.map((item) => ({ id: item.id }))
   const testerPermissionIds = updatedPermissionsInDb.filter((item) => TesterModule.includes(item.module)).map((item) => ({ id: item.id }))
   
   await Promise.all([
      updateRole(adminPermissionIds, 'Admin'),
      updateRole(testerPermissionIds, 'Tester'),
      // updateRole(clientPermissionIds, RoleName.Client)
   ]);

   process.exit(0)
}  

const updateRole = async (
  permissionIds: { id: number }[],
  roleName: string,
) => {
  const roleRepo = dataSource.getRepository(Role);
  const permissionRepo = dataSource.getRepository(Permission);

  const role = await roleRepo.findOne({
    where: {
      name: roleName,
      deletedAt: IsNull(),
    },
    relations: ['permissions'],
  });

  if (!role) {
    throw new Error(`Role ${roleName} not found`);
  }

  const permissions = await permissionRepo.find({
    where: {
      id: In(permissionIds.map(p => p.id)),
    },
  });

  role.permissions = permissions;

  await roleRepo.save(role);
};

