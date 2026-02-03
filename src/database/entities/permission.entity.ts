import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from './role.entity';
import { BaseEntity } from './base.entity';
import { HttpMethod } from 'src/shared/constants/other.constant';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ length: 1000 })
  path: string;

  @Column({
    type: 'enum',
    enum: HttpMethod,
  })
  method: HttpMethod;

  @Column({ default: '' })
  module: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}