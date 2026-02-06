import { PermissionSchema } from "src/shared/models/share-permission.model";
import z from "zod";

export const RoleSchema = z.object({
   id: z.number().optional(),
   name: z.string(),
   description: z.string()
})

export const CreateRoleBodySchema = RoleSchema.pick({
   name: true,
   description: true
}).strict()

export const GetRolesBodySchema = z.object({
   page: z.number(),
   limit: z.number()
}).strict()

export const GetRolesResSchema = z.object({
  data: z.array(
      RoleSchema.pick({
         id: true,
         name: true,
         description: true,
      })
  ),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
});

export type CreateRoleBodyType = z.infer<typeof CreateRoleBodySchema>;
export type GetRolesBodyType = z.infer<typeof GetRolesBodySchema>;
export type GetRolesResType = z.infer<typeof GetRolesResSchema>;