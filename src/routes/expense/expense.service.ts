import { Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseRepo } from './expense.repo';
import { CreateExpenseBodyType, GetExpensesQueryPaginationType, GetExpensesQueryType, UpdateExpenseBodyType } from './expense.model';

@Injectable()
export class ExpenseService {
  constructor(private readonly expenseRepo: ExpenseRepo) {}

  list(query: GetExpensesQueryType) {
    return this.expenseRepo.list(query);
  }

  async getById(id: number) {
    const expense = await this.expenseRepo.getById(id);
    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  create(body: CreateExpenseBodyType) {
    return this.expenseRepo.create(body);
  }

  async update(id: number, body: UpdateExpenseBodyType) {
    const existing = await this.expenseRepo.getById(id);
    if (!existing) throw new NotFoundException('Expense not found');

    return await this.expenseRepo.update(id, body);
  }

  async delete(id: number) {
    const existing = await this.expenseRepo.getById(id);
    if (!existing) throw new NotFoundException('Expense not found');

    return await this.expenseRepo.delete(id);
  }

  async getExpensesByProject(projectId: number, query: GetExpensesQueryPaginationType) {
    return await this.expenseRepo.getExpensesByProject(projectId, query);
  }

  async getProjectExpenseSummary(projectId: number) {
    const [totalAmount, totalItems, latestExpense] = await Promise.all([
      this.expenseRepo.getTotalExpenseByProject(projectId),
      this.expenseRepo.countExpenseByProject(projectId),
      this.expenseRepo.getLatestExpenseByProject(projectId),
    ]);

    return {
      totalAmount,
      totalItems,
      latestExpense,
    };
  }
}
