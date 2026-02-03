import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Bug } from "./bug.entity";
import { User } from "./user.entity";

// bug_comment.entity.ts
@Entity('bug_comments')
export class BugComment extends BaseEntity {
  @ManyToOne(() => Bug, (bug) => bug.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bugId' })
  bug: Bug;

  @Column()
  bugId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column('text')
  content: string;
}