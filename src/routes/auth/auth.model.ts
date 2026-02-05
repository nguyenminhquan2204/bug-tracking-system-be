import { UserSchema } from "src/shared/models/share-user.model";
import z from "zod";

export const LoginBodySchema = UserSchema.pick({
   email: true,
   password: true
}).strict()

export const RefreshTokenBodySchema = z.object({
   refreshToken: z.string()
}).strict()

export type LoginBodyType = z.infer<typeof LoginBodySchema>;
export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>;

