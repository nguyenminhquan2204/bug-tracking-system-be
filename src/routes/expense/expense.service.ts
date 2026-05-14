import { Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseRepo } from './expense.repo';
import { CreateExpenseBodyType, GetExpensesQueryType, UpdateExpenseBodyType } from './expense.model';

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

  async getExpensesByProject(projectId: number) {
    return await this.expenseRepo.getExpensesByProject(projectId);
  }

  async getTotalExpenseByProject(projectId: number) {
    return await this.expenseRepo.getTotalExpenseByProject(projectId);
  }
}
