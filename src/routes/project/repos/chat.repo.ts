import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConversationParticipant } from "src/database/entities/conversation-participant.entity";
import { Conversation } from "src/database/entities/conversation.entity";
import { Repository } from "typeorm";

@Injectable()
export class ChatRepo {
   constructor(
      @InjectRepository(Conversation)
      private readonly conversaRepo: Repository<Conversation>,

      @InjectRepository(ConversationParticipant)
      private readonly conversaPartRepo: Repository<ConversationParticipant>
   ) {}

   async createConversation(fromUserId: number, toUserId: number) {
      const existing = await this.conversaRepo
         .createQueryBuilder('c')
         .innerJoin(
            'conversation_participants',
            'cp1',
            'cp1.conversationId = c.id AND cp1.userId = :fromUserId',
            { fromUserId }
         )
         .innerJoin(
            'conversation_participants',
            'cp2',
            'cp2.conversationId = c.id AND cp2.userId = :toUserId',
            { toUserId }
         )
         .where('c.type = :type', { type: 'private' })
         .getOne();

      if (existing) {
         return existing;
      }

      const conversation = await this.conversaRepo.save({
         type: 'private',
      });

      await this.conversaPartRepo.save([
         {
            conversationId: conversation.id,
            userId: fromUserId,
         },
         {
            conversationId: conversation.id,
            userId: toUserId,
         },
      ]);

      return conversation;
   }
}