import z from "zod";

export const AddMembersSchema = z.array(
   z.object({
      id: z.number(),
      role: z.string()
   }).strict()
)

export const DeleteMemberParamsSchema = z.object({
   id: z.coerce.number(),
   userId: z.coerce.number()
}).strict()

export type AddMembersType = z.infer<typeof AddMembersSchema>;
export type DeleteMemberParamsType = z.infer<typeof DeleteMemberParamsSchema>;
