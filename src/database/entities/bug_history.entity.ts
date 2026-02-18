import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Bug } from "./bug.entity";
import { User } from "./user.entity";

@Entity('bug_history')
export class BugHistory extends BaseEntity {
  @ManyToOne(() => Bug, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bugId' })
  bug: Bug;

  @Column()
  bugId: number;

  @Column()
  fieldChanged: string;

  @Column({ type: 'text', nullable: true })
  oldValue: string | null;

  @Column({ type: 'text', nullable: true })
  newValue: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updatedBy' })
  updatedByUser?: User;
  
}