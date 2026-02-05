import { createZodDto } from "nestjs-zod";
import { LoginBodySchema } from "./auth.model";

export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}