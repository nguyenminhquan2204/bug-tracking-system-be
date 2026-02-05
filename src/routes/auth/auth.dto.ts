import { createZodDto } from "nestjs-zod";
import { LoginBodySchema, RefreshTokenBodySchema } from "./auth.model";

export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}
export class RefreshTokenBodyDTO extends createZodDto(RefreshTokenBodySchema) {}
