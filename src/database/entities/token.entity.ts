import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
// import { TokenType } from 'src/shared/constants/other.constant';
import { TokenType } from '../../shared/constants/other.constant';

@Entity('tokens')
export class Token extends BaseEntity {
   @Column({ type: 'uuid', unique: true })
  tokenId: string;

  @Column({ name: 'tokenHash', length: 255 })
  tokenHash: string;

  @Column({
    name: 'token_type',
    type: 'enum',
    enum: TokenType,
    default: TokenType.REFRESH,
  })
  tokenType: TokenType;

  @Column({ name: 'expiresAt', type: 'timestamp' })
  expiresAt: Date;

   @Column({ name: 'revokedAt', type: 'timestamp', nullable: true })
   revokedAt: Date | null;
}
