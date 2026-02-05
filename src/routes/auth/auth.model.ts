import { UserSchema } from "src/shared/models/share-user.model";
import z from "zod";

export const LoginBodySchema = UserSchema.pick({
   email: true,
   password: true
})

export type LoginBodyType = z.infer<typeof LoginBodySchema>;