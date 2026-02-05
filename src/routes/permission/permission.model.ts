import { PermissionSchema } from "src/shared/models/share-permission.model";
import z from "zod";

export const CreatePermissionBodySchema = PermissionSchema.pick({
   name: true,
   path: true,
   method: true,
   module: true
}).strict()

export const UpdatePermissionBodySchema = CreatePermissionBodySchema;

export const GetPermissionsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10) 
}).strict()


export type CreatePermissionBodyType = z.infer<typeof CreatePermissionBodySchema>;
export type UpdatePermissionBodyType = z.infer<typeof UpdatePermissionBodySchema>;
export type GetPermissionsQueryType = z.infer<typeof GetPermissionsQuerySchema>;
