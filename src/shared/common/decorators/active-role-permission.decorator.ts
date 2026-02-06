import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { REQUEST_ROLE_PERMISSIONS } from "../../constants/auth.constant";
import { GetRoleDetailIncludePermissionType } from "src/shared/models/share-role.model";

export const ActiveRolePermissions = createParamDecorator((field: keyof GetRoleDetailIncludePermissionType | undefined, context: ExecutionContext) => {
   const request = context.switchToHttp().getRequest();
   const rolePermissions: GetRoleDetailIncludePermissionType | undefined = request[REQUEST_ROLE_PERMISSIONS];
   return field ? rolePermissions?.[field] : rolePermissions;
})