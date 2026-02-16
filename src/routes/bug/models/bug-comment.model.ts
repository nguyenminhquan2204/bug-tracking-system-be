import z from "zod";

export const BugCommentSchema = z.object({
   id: z.number(),
   bugId: z.number(),
   userId: z.number(),
   content: z.string(),

   createdAt: z.date(),
   updatedAt: z.date().nullable().optional(),
   deletedAt: z.date().nullable().optional(),
   createdBy: z.number().optional(),
   updatedBy: z.number().optional(),
   deletedBy: z.number().optional(),
})

export const CreateBugCommentSchema = BugCommentSchema.pick({
   content: true,
}).strict()

export type BugCommentType = z.infer<typeof BugCommentSchema>;
export type CreateBugCommentType = z.infer<typeof CreateBugCommentSchema>;
