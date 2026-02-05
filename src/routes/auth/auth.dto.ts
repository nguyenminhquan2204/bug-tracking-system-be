import { createZodDto } from "nestjs-zod";
import { LoginBodySchema, LogoutBodySchema, RefreshTokenBodySchema } from "./auth.model";

export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}
export class RefreshTokenBodyDTO extends createZodDto(RefreshTokenBodySchema) {}
export class LogoutBodyDTO extends createZodDto(LogoutBodySchema) {}