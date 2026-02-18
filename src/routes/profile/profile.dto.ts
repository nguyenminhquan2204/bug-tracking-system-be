import { createZodDto } from "nestjs-zod";
import { UpdateProfileSchema } from "./profile.model";

export class UpdateProfileDTO extends createZodDto(UpdateProfileSchema) {}