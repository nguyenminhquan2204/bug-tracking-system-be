import { Injectable } from '@nestjs/common';
import { ChatRepo } from '../repos/chat.repo';

@Injectable()
export class ChatService {
   constructor(
      private readonly chatRepo: ChatRepo
   ) {}

   createConversation(fromUserId: number, toUserId: number) {
      return this.chatRepo.createConversation(fromUserId, toUserId);
   }
}
