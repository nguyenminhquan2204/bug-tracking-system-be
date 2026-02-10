import { createZodDto } from "nestjs-zod";
import { AddMembersSchema, DeleteMemberParamsSchema } from "./project-member.model";

export class AddMembersDTO extends createZodDto(AddMembersSchema) {}
export class DeleteMemberParamsDTO extends createZodDto(DeleteMemberParamsSchema) {}