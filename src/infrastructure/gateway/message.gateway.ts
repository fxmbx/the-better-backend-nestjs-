import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server } from 'ws';
import { LoggerService } from '../logger/logger.service';

@WebSocketGateway({ namespace: '/chat' })
export class MessgaeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly logger: LoggerService) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('joinRoom')
  public handleJoinRoom(client: Socket, room: string): void {
    client.join(room);
    client.emit('joinedRoom', room);
  }
  @SubscribeMessage('leaveRoom')
  public handleLeaveRoom(client: Socket, room: string): void {
    client.leave(room);
    client.emit('leftRoom', room);
  }
  @SubscribeMessage('msgToServer')
  public handleMessage(client: Socket, payload: any): Promise<WsResponse<any>> {
    return this.server.to(payload.room).emit('msgToCLient', payload);
  }

  handleDisconnect(client: any) {
    this.logger.log('handleDisconnect', `${client.id} disconnected`);
  }
  handleConnection(client: any, ...args: any[]) {
    this.logger.log('handleDisconnect', `${client.id} connected`);
  }
  afterInit(server: Server) {
    this.logger.log('afterInit', `${server} initialised`);
  }
}
