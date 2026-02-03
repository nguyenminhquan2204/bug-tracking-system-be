import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Bug } from "./bug.entity";
import { File } from "./file.entity";

@Entity('bug_attachments')
export class BugAttachment extends BaseEntity {
  @PrimaryColumn()
  bugId: number;

  @PrimaryColumn()
  fileId: number;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Bug, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bugId' })
  bug: Bug;

  @ManyToOne(() => File)
  @JoinColumn({ name: 'fileId' })
  file: File;
}