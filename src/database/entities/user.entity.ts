import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ name: 'userName', length: 100 })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password', select: false })
  password: string;

  @Column({ name: 'roleId' })
  roleId: number;

  @Column({ name: 'imageId', nullable: true })
  imageId?: number;
}
