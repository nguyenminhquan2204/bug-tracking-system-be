import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';
import { ProjectStatus } from 'src/shared/constants/project.constant';
import { ProjectMember } from './project_member.entity';
import { Bug } from './bug.entity';

@Entity('projects')
export class Project extends BaseEntity {
  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date | null;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.INIT,
  })
  status: ProjectStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'manageUserId' })
  manager: User;

  @Column({ nullable: true })
  manageUserId: number | null;

  @OneToMany(() => Bug, (bug) => bug.project)
  bugs: Bug[];

  @OneToMany(() => ProjectMember, (member) => member.project)
  members: ProjectMember[];
}