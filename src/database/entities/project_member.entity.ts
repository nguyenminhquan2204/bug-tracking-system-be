import { Column, Entity, JoinColumn, ManyToOne, Index } from "typeorm";
import { User } from "./user.entity";
import { Project } from "./project.entity";
import { BaseEntity } from "./base.entity";

@Index('idx_project_members_user_id', ['userId'])
@Index('idx_project_members_project_id', ['projectId'])
@Entity('project_members')
export class ProjectMember extends BaseEntity {
  @Column()
  userId: number;

  @Column()
  projectId: number;

  @Column()
  role: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Project, (project) => project.members)
  @JoinColumn({ name: 'projectId' })
  project: Project;
}