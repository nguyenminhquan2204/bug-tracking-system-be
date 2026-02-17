import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Bug } from "./bug.entity";
import { User } from "./user.entity";
import { BugAttachment } from "./bug_attactment.entity";

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

  @OneToMany(() => BugAttachment, (attachment) => attachment.comment)
  attachments: BugAttachment[]

  @Column('text')
  content: string;
}