import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ActiveUser } from 'src/shared/common/decorators/active-user.decorator';
import { DEFAULT_SUCCESS_MESSAGE, HttpStatus, SuccessResponse } from 'src/shared/helpers/response';
import { NotificationService } from 'src/shared/services/notification.service';

@Controller('notification')
export class NotificationController {
   constructor(private readonly notificationService: NotificationService) {}

   @Get()
   async getMyNotification(@ActiveUser('userId') userId: number) {
      const response = await this.notificationService.myNotification(userId);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }

   @Get('read/:id')
   async readNotification(@Param('id', ParseIntPipe) id: number) {
      const response = await this.notificationService.readNotification(id);
      return new SuccessResponse(response, DEFAULT_SUCCESS_MESSAGE, HttpStatus.OK);
   }
}
