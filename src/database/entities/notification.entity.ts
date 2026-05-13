import { NotificationType } from 'src/shared/constants/other.constant';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

   @Column()
  @Index()
  userId: number;

  @Column()
  senderName: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ default: false })
  @Index()
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}