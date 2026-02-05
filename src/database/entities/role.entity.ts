import { Entity, Column, OneToMany, ManyToMany, JoinTable, Relation } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Permission } from './permission.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ name: 'name', length: 100, unique: true })
  name: string;

  @Column({ name: 'description' })
  description: string;

  @ManyToMany(() => Permission, (permission) => permission.roles, { cascade: false })
  @JoinTable({ name: 'role_permissions' })
  permissions: Permission[];
}
