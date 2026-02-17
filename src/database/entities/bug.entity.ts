import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Project } from './project.entity';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';
import { BugPriority, BugStatus } from 'src/shared/constants/bug.constant';
import { BugHistory } from './bug_history.entity';
import { BugComment } from './bug_comment.entity';

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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'developerId' })
  developer: User;

  @Column()
  developerId: number;

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

  @OneToMany(() => BugComment, (comment) => comment.bug)
  comments: BugComment[];

  @OneToMany(() => BugHistory, (history) => history.bug)
  history: BugHistory[];
}