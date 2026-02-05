import { HttpMethod } from "src/shared/constants/other.constant";
import z from "zod";

export const PermissionSchema = z.object({
   id: z.number(),
   name: z.string().max(500),
   description: z.string(),
   module: z.string().max(500),
   path: z.string().max(1000),
   method: z.nativeEnum(HttpMethod),

   createdAt: z.date(),
   updatedAt: z.date().nullable().optional(),
   deletedAt: z.date().nullable().optional(),
   createdBy: z.number().optional(),
   updatedBy: z.number().nullable().optional(),
   deletedBy: z.number().nullable().optional(),
})

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


export type PermissionType = z.infer<typeof PermissionSchema>;
export type CreatePermissionBodyType = z.infer<typeof CreatePermissionBodySchema>;
export type UpdatePermissionBodyType = z.infer<typeof UpdatePermissionBodySchema>;
export type GetPermissionsQueryType = z.infer<typeof GetPermissionsQuerySchema>;
