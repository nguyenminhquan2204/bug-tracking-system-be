 import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.entity';
import { Token } from './token.entity';
import { File } from './file.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ name: 'userName', length: 100 })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'roleId' })
  roleId: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role: Role

  @Column({ name: 'imageId', nullable: true })
  imageId?: number;

  @ManyToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'imageId' })
  avatar?: File;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];
}
