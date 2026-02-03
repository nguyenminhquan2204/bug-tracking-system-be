import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Project } from './project.entity';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';
import { BugPriority, BugStatus } from 'src/shared/constants/bug.constant';
import { BugHistory } from './bug_history.entity';
import { BugAttachment } from './bug_attactment.entity';
import { BugComment } from './bug_comment.entity';
import { BugAssignment } from './bug_assignment.entity';

@Entity('bugs')
export class Bug extends BaseEntity {
  @Column()
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(() => Project, (project) => project.bugs)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  projectId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reporterId' })
  reporter: User;

  @Column()
  reporterId: number;

  @Column({
    type: 'enum',
    enum: BugStatus,
    default: BugStatus.TODO,
  })
  status: BugStatus;

  @Column({
    type: 'enum',
    enum: BugPriority,
    default: BugPriority.LOW,
  })
  priority: BugPriority;

  @OneToMany(() => BugAssignment, (assign) => assign.bug)
  assignments: BugAssignment[];

  @OneToMany(() => BugComment, (comment) => comment.bug)
  comments: BugComment[];

  @OneToMany(() => BugAttachment, (attach) => attach.bug)
  attachments: BugAttachment[];

  @OneToMany(() => BugHistory, (history) => history.bug)
  history: BugHistory[];
}