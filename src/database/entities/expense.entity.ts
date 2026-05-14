import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Project } from './project.entity';

export enum ExpenseStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

@Entity('expenses')
export class Expense extends BaseEntity {
   @Column({
      comment: 'Expense name',
   })
   name: string;

   @Column('text', {
      nullable: true,
      comment: 'Expense description',
   })
   description: string;

   @Column({
      type: 'date',
      comment: 'Payment date',
   })
   paymentDate: Date;

   @Column({
      type: 'decimal',
      precision: 12,
      scale: 2,
      comment: 'Expense amount',
   })
   amount: number;

   @Column({
      default: 'VND',
      comment: 'Currency',
   })
   currency: string;

   @Column({
      type: 'enum',
      enum: ExpenseStatus,
      default: ExpenseStatus.PENDING,
   })
   status: ExpenseStatus;

   @Column({
      nullable: true,
      comment: 'Receipt or invoice url',
   })
   receiptUrl: string;

   @Column()
   buyerId: number;

   @ManyToOne(() => User, {
      nullable: false,
   })
   @JoinColumn({
      name: 'buyerId',
   })
   buyer: User;

   @Column()
   managerId: number;

   @ManyToOne(() => User, {
      nullable: true,
   })
   @JoinColumn({
      name: 'managerId',
   })
   manager: User;

   @Column()
   projectId: number;

   @ManyToOne(() => Project, (project) => project.expenses, {
      nullable: false,
      onDelete: 'CASCADE',
   })
   @JoinColumn({
      name: 'projectId',
   })
   project: Project;
}