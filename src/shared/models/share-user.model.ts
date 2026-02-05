import z from "zod";
import { RoleSchema } from "./share-role.model";

export const UserSchema = z.object({
  id: z.number(),
  userName: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string(),
  roleId: z.number(),
  isActive: z.boolean(),
  imageId: z.number().optional(),

  role: RoleSchema,

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable().optional(),
  deletedAt: z.coerce.date().nullable().optional(),

  createdBy: z.number().nullable().optional(),
  updatedBy: z.number().nullable().optional(),
  deletedBy: z.number().nullable().optional(),
});

export type UserType = z.infer<typeof UserSchema>;
