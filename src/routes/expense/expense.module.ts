import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from 'src/database/entities/expense.entity';
import { ExpenseService } from './expense.service';
import { ExpenseRepo } from './expense.repo';
import { ExpenseController } from './controllers/expense.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Expense])],
  controllers: [ExpenseController],
  providers: [ExpenseService, ExpenseRepo],
  exports: [ExpenseService, ExpenseRepo],
})
export class ExpenseModule {}
