import { Injectable } from '@nestjs/common'
import { MessageRepo } from '../repos/message.repo';

@Injectable()
export class MessageService {
   constructor(private readonly messageRepo: MessageRepo) {}

   createMessage(conversationId: number, senderId: number, content: string) {
      return this.messageRepo.createMessage(conversationId, senderId, content);
   }

   getMessages(conversationId: number) {
      return this.messageRepo.getMessages(conversationId);
   }
}
