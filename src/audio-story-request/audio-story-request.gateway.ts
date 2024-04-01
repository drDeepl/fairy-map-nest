import { Logger, UseGuards } from '@nestjs/common';
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
import { EditAudioStoryRequestDto } from './dto/audio-story-request/EditAudioStoryRequestDto';
import { AudioRequestWithUserAudioDto } from './dto/audio-story-request/AudioRequestWithUserAudioDto';
import { UserAccessInterface } from '@/auth/interface/UserAccessInterface';
import { UserAccessDto } from '@/user/dto/UserAccessDto';

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
    // @ConnectedSocket() client: SocketWithAuth,
    audioRequestWithUserAudioDto: AudioRequestWithUserAudioDto,
  ): Promise<void> {
    this.logger.warn('STATUSES');
    // console.log(client);
    // console.log(payload);
    const { sockets } = this.server.sockets;
    for (const [, client] of sockets) {
      const user: UserAccessDto = (client as SocketWithAuth).user;

      if (audioRequestWithUserAudioDto.userId === user.sub) {
        client.emit('statuses', {
          ...JSON.parse(JSON.stringify(audioRequestWithUserAudioDto)),
        });
      }

      // if (
      //   (client as SocketWithAuth).user.sub ===
      //   audioRequestWithUserAudioDto.userId
      // ) {
      //   console.log(
      //     `status request for user ${audioRequestWithUserAudioDto.userId}`,
      //   );
      // }
    }
    // console.group('payload');
    // console.log(payload);
    // const user: User = (client?.handshake as any)?.user;
    // const message = await this.chatsService.createMessage(payload, user);
    // this.server.to(String(payload?.chatId)).emit('messageToClient', message);
  }
}
