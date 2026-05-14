import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from 'src/database/entities/expense.entity';
import { Repository } from 'typeorm';
import { CreateExpenseBodyType, GetExpensesQueryType, UpdateExpenseBodyType } from './expense.model';

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

  async getExpensesByProject(projectId: number) {
    return await this.repository.find({
      where: { projectId },
      relations: ['buyer', 'manager'],
      order: { createdAt: 'DESC' },
    });
  }

  async getTotalExpenseByProject(projectId: number) {
    const result = await this.repository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.projectId = :projectId', { projectId })
      .where('expense.status = :status', { status: 'PAID' })
      .getRawOne();

    return result?.total || 0;
  }
}
