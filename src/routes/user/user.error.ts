import { NotFoundException } from "@nestjs/common";

export const UserNotFound = new NotFoundException('Error.UserNotFound');