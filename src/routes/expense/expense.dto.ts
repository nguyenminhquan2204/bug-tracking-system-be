import { createZodDto } from 'nestjs-zod';
import { CreateExpenseBodySchema, GetExpensesQuerySchema, UpdateExpenseBodySchema } from './expense.model';

export class CreateExpenseBodyDTO extends createZodDto(CreateExpenseBodySchema) {}
export class UpdateExpenseBodyDTO extends createZodDto(UpdateExpenseBodySchema) {}
export class GetExpensesQueryDTO extends createZodDto(GetExpensesQuerySchema) {}
