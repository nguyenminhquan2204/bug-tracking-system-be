import { UserSchema } from "src/shared/models/share-user.model";
import z from "zod";

export const UpdateProfileSchema = UserSchema.pick({
   userName: true,
   email: true,
   imageId: true
}).strict()

export type UpdateProfileType = z.infer<typeof UpdateProfileSchema>;