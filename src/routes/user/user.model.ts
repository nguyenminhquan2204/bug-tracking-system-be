import { UserSchema } from 'src/shared/models/share-user.model';
import { z } from 'zod';

export const CreateUserBodySchema = UserSchema.pick({
  userName: true,
  email: true,
  password: true,
  roleId: true,
}).strict();

export const UpdateUserBodySchema = UserSchema.pick({
  userName: true,
  roleId: true,
}).strict()

export const GetUsersQuerySchema = z.object({
   page: z.coerce.number().int().positive().default(1),
   limit: z.coerce.number().int().positive().default(10),
}).strict();

export const GetUsersResSchema = z.object({
  data: z.array(
    UserSchema.pick({
      id: true,
      userName: true,
      email: true,
      roleId: true,
    })
  ),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
});

export const GetDetailUserResSchema = UserSchema.omit({
  password: true
});

export type CreateUserBodyType = z.infer<typeof CreateUserBodySchema>;
export type GetUsersQueryType = z.infer<typeof GetUsersQuerySchema>;
export type GetUsersResType = z.infer<typeof GetUsersResSchema>;
export type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>;
export type GetDetailUserResType = z.infer<typeof GetDetailUserResSchema>;