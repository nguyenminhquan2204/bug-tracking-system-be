import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType } from '../constants/other.constant';
import { NotificationRepo } from '../repos/notification.repo';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepo: NotificationRepo
  ) {}

  async readNotification(id: number) {
    return await this.notificationRepo.readNotification(id);
  }

  async myNotification(userId: number) {
   const data = await this.notificationRepo.myNotification(userId);
   if(!data?.items || data?.items.length === 0) throw new NotFoundException('My Notification is empty');
   return data;
  }

  async createNotificationMessage(payload: {
    receiverId: number;
    senderId: number;
    senderName: string;
    content: string;
  }) {
      const data = {
         title: NotificationType.MESSAGE,
         type: NotificationType.MESSAGE,
         content: payload.content,
         userId: payload.receiverId,
         senderName: payload.senderName
      }
      return await this.notificationRepo.createNotification(data)
  }
}