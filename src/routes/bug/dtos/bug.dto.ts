import { createZodDto } from "nestjs-zod";
import { BugGetListQuerySchema, CreateBugBodySchema, GetBugsQueryBodySchema, UpdateBugBodySchema, UpdateBugPriorityParamsSchema, UpdateBugStatusParamsSchema } from "../models/bug.model";

export class GetBugsQueryBodyDTO extends createZodDto(GetBugsQueryBodySchema) {}
export class CreateBugBodyDTO extends createZodDto(CreateBugBodySchema) {}
export class UpdateBugBodyDTO extends createZodDto(UpdateBugBodySchema) {}
export class UpdateBugStatusParamsDTO extends createZodDto(UpdateBugStatusParamsSchema) {}
export class UpdateBugPriorityParamsDTO extends createZodDto(UpdateBugPriorityParamsSchema) {}
export class BugGetListQueryDTO extends createZodDto(BugGetListQuerySchema) {}