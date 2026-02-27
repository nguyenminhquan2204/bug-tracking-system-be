import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('conversation_participants')
export class ConversationParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  conversationId: number;

  @Column()
  userId: number;
}