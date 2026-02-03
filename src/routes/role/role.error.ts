import { ConflictException } from "@nestjs/common";

export const AdminAlready = new ConflictException('Error.AdminAlready');
