import { createZodDto } from "nestjs-zod";
import { CreateProjectBodySchema, GetProjectsQueryBodySchema, UpdateProjectBodySchema } from "./project.model";

export class CreateProjectBodyDTO extends createZodDto(CreateProjectBodySchema) {}
export class UpdateProjectBodyDTO extends createZodDto(UpdateProjectBodySchema) {}
export class GetProjectsQueryBodyDTO extends createZodDto(GetProjectsQueryBodySchema) {}
