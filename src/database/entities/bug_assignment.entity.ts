import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Bug } from "./bug.entity";
import { User } from "./user.entity";

@Entity('bug_assignments')
export class BugAssignment extends BaseEntity {

  @ManyToOne(() => Bug, (bug) => bug.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bugId' })
  bug: Bug;

  @Column()
  bugId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column({ type: 'timestamp' })
  assignedAt: Date;

  @Column({ type: 'int', nullable: true })
  assignedBy: number | null;
}