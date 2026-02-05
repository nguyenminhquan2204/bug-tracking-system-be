import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TokenType } from '../../shared/constants/other.constant';
import { User } from './user.entity';

@Entity('tokens')
export class Token extends BaseEntity {
   @Column({ type: 'uuid', unique: true })
  tokenId: string;

  @Column({ name: 'tokenHash', length: 255 })
  tokenHash: string;

  @Column({ type: 'int' })
  userId: number;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    name: 'tokenType',
    type: 'enum',
    enum: TokenType,
    default: TokenType.REFRESH_TOKEN,
  })
  tokenType: TokenType;

  @Column({ name: 'expiresAt', type: 'timestamp' })
  expiresAt: Date;

  @Column({ name: 'revokedAt', type: 'timestamp', nullable: true })
  revokedAt: Date | null;
}
