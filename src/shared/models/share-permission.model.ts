import z from "zod";
import { HttpMethod } from "../constants/other.constant";

export const PermissionSchema = z.object({
   id: z.number(),
   name: z.string().max(500),
   description: z.string(),
   module: z.string().max(500),
   path: z.string().max(1000),
   method: z.nativeEnum(HttpMethod),

   createdAt: z.date(),
   updatedAt: z.date().nullable().optional(),
   deletedAt: z.date().nullable().optional(),
   createdBy: z.number().optional(),
   updatedBy: z.number().nullable().optional(),
   deletedBy: z.number().nullable().optional(),
})

export type PermissionType = z.infer<typeof PermissionSchema>;
