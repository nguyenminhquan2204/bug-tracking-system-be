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
import { MessageService } from 'src/shared/services/message.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: true,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
   private readonly messageService: MessageService,
  ) {}

  // 🟢 Khi connect
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // 🟢 Join conversation room
   @SubscribeMessage('join_conversation')
   handleJoinConversation(
      @ConnectedSocket() client: Socket,
      @MessageBody() payload: {
         conversationId: number;
      },
   ) {
      client.join(`conversation_${payload.conversationId}`);

      console.log(`Socket ${client.id} joined conversation_${payload.conversationId}`);

      return { status: 'joined' };
   }

  // 🟢 Send message
   @SubscribeMessage('send_message')
   async handleSendMessage(
      @ConnectedSocket() client: Socket,
      @MessageBody()
      payload: {
         conversationId: number;
         senderId: number;
         content: string;
      },
   ) {
      console.log('Body: ', payload);

      // TODO: Save DB ở đây
      const message = await this.messageService.createMessage(
         payload.conversationId,
         payload.senderId,
         payload.content,
      );

      // Emit cho toàn bộ room
      this.server
         .to(`conversation_${payload.conversationId}`)
         .emit('receive_message', {
            ...payload,
            createdAt: new Date(),
         });

      return { status: 'sent' };
   }
}