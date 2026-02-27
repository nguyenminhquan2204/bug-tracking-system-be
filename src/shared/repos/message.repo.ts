import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "src/database/entities/mesage.entity";
import { Repository } from "typeorm";

@Injectable()
export class MessageRepo {
   constructor(
      @InjectRepository(Message)
      private readonly repository: Repository<Message>,
   ) {}

   async createMessage(conversationId: number, senderId: number, content: string) {
      const message = this.repository.create({
         conversationId,
         senderId,
         content,
      });
      return this.repository.save(message);
   }    

   async getMessages(conversationId: number) {
      return this.repository.find({
         where: { conversationId },
         order: { createdAt: 'ASC' },
      });
   }
}  