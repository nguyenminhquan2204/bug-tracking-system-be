import { ExpenseStatus } from 'src/database/entities/expense.entity';
import z from 'zod';

export const ExpenseSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
  paymentDate: z.coerce.date(),
  amount: z.number(),
  currency: z.string(),
  status: z.nativeEnum(ExpenseStatus),
  receiptUrl: z.string().optional(),
  buyerId: z.number(),
  managerId: z.number().optional(),
  projectId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  createdBy: z.number().optional(),
  updatedBy: z.number().optional(),
  deletedBy: z.number().optional(),
});

export const GetExpensesQuerySchema = ExpenseSchema.pick({
  name: true,
  status: true,
  paymentDate: true,
  projectId: true,
  buyerId: true,
}).partial().extend({
  page: z.number().default(1),
  limit: z.number().default(10),
});

export const GetExpensesQueryPaginationSchema = GetExpensesQuerySchema.pick({
  page: true,
  limit: true,
}).extend({
  orderBy: z.enum(['createdAt', 'paymentDate']).default('createdAt'),
  orderDirection: z.enum(['ASC', 'DESC']).default('DESC'),
}).strict();

export const CreateExpenseBodySchema = ExpenseSchema.pick({
  name: true,
  description: true,
  paymentDate: true,
  amount: true,
  currency: true,
  receiptUrl: true,
  buyerId: true,
  managerId: true,
  projectId: true,
}).strict();

export const UpdateExpenseBodySchema = CreateExpenseBodySchema.partial();

export type ExpenseType = z.infer<typeof ExpenseSchema>;
export type CreateExpenseBodyType = z.infer<typeof CreateExpenseBodySchema>;
export type UpdateExpenseBodyType = z.infer<typeof UpdateExpenseBodySchema>;
export type GetExpensesQueryType = z.infer<typeof GetExpensesQuerySchema>;
export type GetExpensesQueryPaginationType = z.infer<typeof GetExpensesQueryPaginationSchema>;
