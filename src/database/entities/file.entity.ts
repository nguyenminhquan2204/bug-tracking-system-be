import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('files')
export class File extends BaseEntity {
  @Column()
  name: string;

  @Column()
  type: string;

  @Column() 
  size: string;

  @Column()
  path: string;
}