import z from "zod";

export const BugHistorySchema = z.object({
   id: z.number(),
   bugId: z.number(),
   fieldChanged: z.string().min(1),
   oldValue: z.string().nullable(),
   newValue: z.string().nullable(),

   createdAt: z.date(),
   updatedAt: z.date().nullable().optional(),
   deletedAt: z.date().nullable().optional(),
   createdBy: z.number().optional(),
   updatedBy: z.number().optional(),
   deletedBy: z.number().optional(),
})

export const CreateBugHistorySchema = BugHistorySchema.pick({
   bugId: true,
   fieldChanged: true,
   oldValue: true,
   newValue: true,
   updatedBy: true
}).strict()

export type BugHistoryType = z.infer<typeof BugHistorySchema>;
export type CreateBugHistoryType = z.infer<typeof CreateBugHistorySchema>;
