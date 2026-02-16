import { createZodDto } from "nestjs-zod";
import { CreateBugCommentSchema } from "../models/bug-comment.model";

export class CreateBugCommentDTO extends createZodDto(CreateBugCommentSchema) {}
