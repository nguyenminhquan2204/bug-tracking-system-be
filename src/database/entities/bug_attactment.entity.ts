import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { File } from "./file.entity";
import { BugComment } from "./bug_comment.entity";

@Entity('bug_attachments')
export class BugAttachment extends BaseEntity {

  @Column()
  fileId: number;

  @Column()
  commentId: number;

  @ManyToOne(() => BugComment, (comment) => comment.attachments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commentId' })
  comment: BugComment;

  @ManyToOne(() => File)
  @JoinColumn({ name: 'fileId' })
  file: File;

  @Column({ default: 0 })
  order: number;
}
