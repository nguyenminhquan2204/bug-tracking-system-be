import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { Project } from "./project.entity";
import { BaseEntity } from "./base.entity";

@Entity('project_members')
export class ProjectMember extends BaseEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  projectId: number;

  @Column()
  projectRole: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Project, (project) => project.members)
  @JoinColumn({ name: 'projectId' })
  project: Project;
}