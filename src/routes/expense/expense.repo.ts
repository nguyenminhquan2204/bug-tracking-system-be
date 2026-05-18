import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense, ExpenseStatus } from 'src/database/entities/expense.entity';
import { Repository } from 'typeorm';
import { CreateExpenseBodyType, GetExpensesQueryPaginationType, GetExpensesQueryType, UpdateExpenseBodyType } from './expense.model';

@Injectable()
export class ExpenseRepo {
  constructor(
    @InjectRepository(Expense)
    private readonly repository: Repository<Expense>,
  ) {}

  async list(query: GetExpensesQueryType) {
    const { page, limit, name, status, paymentDate, projectId, buyerId } = query;

    const skip = (page - 1) * limit;

    const qb = this.repository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.buyer', 'buyer')
      .leftJoinAndSelect('expense.manager', 'manager')
      .leftJoinAndSelect('expense.project', 'project')
      .orderBy('expense.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (name) {
      qb.andWhere('expense.name LIKE :name', {
        name: `%${name}%`,
      });
    }

    if (status) {
      qb.andWhere('expense.status = :status', { status });
    }

    if (paymentDate) {
      qb.andWhere('DATE(expense.paymentDate) = DATE(:paymentDate)', {
        paymentDate,
      });
    }

    if (projectId) {
      qb.andWhere('expense.projectId = :projectId', { projectId });
    }

    if (buyerId) {
      qb.andWhere('expense.buyerId = :buyerId', { buyerId });
    }

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      totalItems: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getById(id: number) {
    return await this.repository.findOne({
      where: { id },
      relations: ['buyer', 'manager', 'project'],
    });
  }

  async create(data: CreateExpenseBodyType) {
    const expense = this.repository.create(data);
    return await this.repository.save(expense);
  }

  async update(id: number, data: UpdateExpenseBodyType) {
    await this.repository.update(id, data);
    return await this.getById(id);
  }

  async delete(id: number) {
    return await this.repository.softDelete(id);
  }

  async getExpensesByProject(projectId: number, query: GetExpensesQueryPaginationType) {
    const { page, limit, orderBy, orderDirection } = query;
    const skip = (page - 1) * limit;

    const [expenses, total] = await this.repository.findAndCount({
      where: { projectId },
      relations: ['buyer', 'manager'],
      order: { [orderBy]: orderDirection },
      skip,
      take: limit,
    });

    return {
      items: expenses,
      totalItems: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getTotalExpenseByProject(projectId: number) {
    const result = await this.repository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.projectId = :projectId', { projectId })
      .andWhere('expense.status = :status', { status: 'PAID' })
      .getRawOne();

    return Number(result?.total || 0);
  }

  async countExpenseByProject(projectId: number) {
    return await this.repository.count({
      where: {
        projectId,
      },
    });
  }

  async getLatestExpenseByProject(projectId: number) {
    return await this.repository.findOne({
      where: {
        projectId,
        status: ExpenseStatus.PAID,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
