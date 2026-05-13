import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'notification',
  cors: true,
})
export class NotificationGateWay implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor() {}

  // 🟢 Khi connect
  handleConnection(client: Socket) {
    console.log('Client notification connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client notification disconnected:', client.id);
  }

   @SubscribeMessage('join_notification')
   handleJoinConversation(
      @ConnectedSocket() client: Socket,
      @MessageBody() payload: {
         userId: number;
      },
   ) {
      client.join(`notification_${payload.userId}`);

      console.log(`Socket ${client.id} joined notification_${payload.userId}`);

      return { status: 'joined' };
   }

   @SubscribeMessage('send_notification')
   sendToUser(userId: number, event: string, data: any) {
      this.server.to(`notification_${userId}`).emit(event, data);
   }
}