import { ProjectStatus } from 'src/shared/constants/project.constant';
import z from 'zod';

export const ProjectSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable(),
  status: ProjectStatus,
  manageUserId: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
  createdBy: z.number().optional(),
  updatedBy: z.number().nullable().optional(),
  deletedBy: z.number().nullable().optional(),
})

export const GetProjectsQueryBodySchema = z.object({
   page: z.number().default(1),
   limit: z.number().default(10)
})

export const   CreateProjectBodySchema = ProjectSchema.pick({
   name: true,
   description: true,
   startDate: true,
   endDate: true,
   manageUserId: true
}).strict()

export const UpdateProjectBodySchema = CreateProjectBodySchema;

export type ProjectType = z.infer<typeof ProjectSchema>;
export type CreateProjectBodyType = z.infer<typeof CreateProjectBodySchema>;
export type UpdateProjectBodyType = z.infer<typeof UpdateProjectBodySchema>;
export type GetProjectsQueryBodyType = z.infer<typeof GetProjectsQueryBodySchema>;

