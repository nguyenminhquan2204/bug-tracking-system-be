import { createZodDto } from "nestjs-zod";
import { CreateRoleBodySchema, GetRolesBodySchema } from "./role.model";

export class CreateRoleBodyDTO extends createZodDto(CreateRoleBodySchema) {}
export class GetRolesBodyDTO extends createZodDto(GetRolesBodySchema) {}


