import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { AudioStoryRequestService } from './audio-story-request.service';
import { SocketWithAuth } from './socket-io-adapter';

@WebSocketGateway(3002, { cors: true, transports: ['websocket'] })
export class AudioStoryRequestGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private readonly logger: Logger = new Logger(AudioStoryRequestGateway.name);

  constructor(
    private readonly audioStoryRequestService: AudioStoryRequestService,
  ) {}

  afterInit(server: Server): void {
    this.logger.warn('Init');
  }

  handleDisconnect(client: Socket): void {
    this.logger.warn(`Client disconnected: ${client.id}`);
  }

  handleConnection(@ConnectedSocket() client: SocketWithAuth): void {
    const { sockets } = this.server.sockets;
    console.log(client);
    this.logger.warn(`Client connected: ${client.id}`);
    this.logger.log(
      `Notification Client id: ${client.id} ${client.user.sub} connected`,
    );
    this.logger.debug(
      `Number of connected notification clients: ${sockets.size}`,
    );
  }

  @SubscribeMessage('statuses')
  async handleRequest(
    @ConnectedSocket() client: SocketWithAuth,
    payload: any,
  ): Promise<void> {
    this.logger.warn('STATUSES');
    console.log(client);
    console.log(payload);
    // const user: User = (client?.handshake as any)?.user;
    // const message = await this.chatsService.createMessage(payload, user);
    // this.server.to(String(payload?.chatId)).emit('messageToClient', message);
  }
}
