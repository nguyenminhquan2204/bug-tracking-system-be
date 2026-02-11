import { BugPriority, BugStatus } from 'src/shared/constants/bug.constant';
import z from 'zod';

export const BugSchema = z.object({
   id: z.number(),
   title: z.string().min(1),
   description: z.string(),
   projectId: z.number(),
   reporterId: z.number(),
   status: z.nativeEnum(BugStatus),
   priority: z.nativeEnum(BugPriority),
   createdAt: z.date(),
   updatedAt: z.date().nullable().optional(),
   deletedAt: z.date().nullable().optional(),
   createdBy: z.number().optional(),
   updatedBy: z.number().nullable().optional(),
   deletedBy: z.number().nullable().optional(),
})

export const CreateBugBodySchema = BugSchema.pick({
   title: true,
   description: true,
   projectId: true,
   reporterId: true,
   priority: true
}).strict()

export const UpdateBugBodySchema = CreateBugBodySchema;

export const GetBugsQueryBodySchema = z.object({
   limit: z.number().default(10),
   page: z.number().default(1)
}).strict()

export const GetBugsResSchema = z.object({
   data: z.array(
      BugSchema.pick({
         id: true,
         title: true,
         description: true,
         projectId: true,
         reporterId: true,
         status: true,
         priority: true
      })
   ),
   totalItems: z.number(),
   page: z.number(),
   limit: z.number(),
   totalPages: z.number()
});

export const UpdateBugStatusParamsSchema = BugSchema.pick({
   status: true
})

export const UpdateBugPriorityParamsSchema = BugSchema.pick({
   priority: true
})

export type BugType = z.infer<typeof BugSchema>;
export type CreateBugBodyType = z.infer<typeof CreateBugBodySchema>;
export type UpdateBugBodyType = z.infer<typeof UpdateBugBodySchema>;
export type GetBugsQueryBodyType = z.infer<typeof GetBugsQueryBodySchema>;
export type GetBugsResType = z.infer<typeof GetBugsResSchema>;