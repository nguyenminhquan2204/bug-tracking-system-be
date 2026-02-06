import z from "zod";
import { PermissionSchema } from "./share-permission.model";

export const RoleSchema = z.object({
   id: z.number(),
   name: z.string(),
   description: z.string(),

   createdAt: z.coerce.date(),
   updatedAt: z.coerce.date().nullable().optional(),
   deletedAt: z.coerce.date().nullable().optional(),

   createdBy: z.number().nullable().optional(),
   updatedBy: z.number().nullable().optional(),
   deletedBy: z.number().nullable().optional(),
})

export const GetRoleDetailIncludePermission = RoleSchema.extend({
   permissions: z.array(PermissionSchema)
})

export type RoleType = z.infer<typeof RoleSchema>;
export type GetRoleDetailIncludePermissionType = z.infer<typeof GetRoleDetailIncludePermission>;
