import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  userName: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string(),
  roleId: z.number(),
  isActive: z.boolean(),
  imageId: z.number().nullable(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  deletedAt: z.coerce.date().nullable(),

  createdBy: z.number().nullable(),
  updatedBy: z.number().nullable(),
  deletedBy: z.number().nullable(),
});

export const CreateUserBodySchema = UserSchema.pick({
  userName: true,
  email: true,
  password: true,
  roleId: true,
}).strict();

export type CreateUserBodyType = z.infer<typeof CreateUserBodySchema>;
