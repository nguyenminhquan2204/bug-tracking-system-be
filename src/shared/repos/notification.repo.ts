import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notification } from "src/database/entities/notification.entity";
import { Repository } from "typeorm";

@Injectable()
export class NotificationRepo {
   constructor(
      @InjectRepository(Notification)
      private readonly repository: Repository<Notification>,
   ) {}

   async readNotification(id: number) {
      const result = await this.repository.update(id, {
         isRead: true
      })
      if (result.affected === 0) throw new NotFoundException('Notification not found');
      return result;
   }

   async myNotification(userId: number) {
      const [data, total] = await this.repository.findAndCount({
         where: {
            userId,
            isRead: false,
         },
      });

      return {
         items: data,
         totalItems: total
      };
   }

   async createNotification(data: any) {
      return await this.repository.save(data);
   }    
}  