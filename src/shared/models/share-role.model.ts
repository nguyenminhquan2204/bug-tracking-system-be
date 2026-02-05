import z from "zod";

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

export type RoleType = z.infer<typeof RoleSchema>