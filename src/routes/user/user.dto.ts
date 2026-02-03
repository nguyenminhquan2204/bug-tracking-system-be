import { createZodDto } from 'nestjs-zod';
import { CreateUserBodySchema } from './user.model';

export class CreateUserBodyDTO extends createZodDto(CreateUserBodySchema) {}
