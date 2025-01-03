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

import { UserAccessDto } from '@/app/modules/user/dto/UserAccessDto';
import { AddStoryRequestDto } from './dto/AddStoryRequestDto';
import { AddStoryRequestRepository } from './add-story-request.repository';
import { SocketWithAuth } from '@/shared/ws-story-request/socket-io-adapter';

@WebSocketGateway(3002, { cors: true, transports: ['websocket'] })
export class AddStoryRequestGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private readonly logger: Logger = new Logger(AddStoryRequestGateway.name);

  constructor(private addStoryRequestRepository: AddStoryRequestRepository) {}

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

  @SubscribeMessage('add-story-requests')
  async handleRequest(addStoryRequestDto: AddStoryRequestDto): Promise<void> {
    this.logger.warn('STATUSES');

    const { sockets } = this.server.sockets;
    for (const [, client] of sockets) {
      const user: UserAccessDto = (client as SocketWithAuth).user;
    }
  }
}
