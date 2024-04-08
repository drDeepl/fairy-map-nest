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

import { AudioStoryRequestService } from '@/audio-story-request/audio-story-request.service';
import { SocketWithAuth } from '../ws-story-request/socket-io-adapter';
import { EditAudioStoryRequestDto } from '@/audio-story-request/dto/audio-story-request/EditAudioStoryRequestDto';
import { AudioRequestWithUserAudioDto } from '@/audio-story-request/dto/audio-story-request/AudioRequestWithUserAudioDto';
import { UserAccessInterface } from '@/auth/interface/UserAccessInterface';
import { UserAccessDto } from '@/user/dto/UserAccessDto';
import { AddStoryRequestDto } from '@/add-story-request/dto/AddStoryRequestDto';
import { AddStoryRequestEntity } from '@/add-story-request/entity/AddStoryRequestEntity';

@WebSocketGateway(3002, { cors: true, transports: ['websocket'] })
export class StoryRequestGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private readonly logger: Logger = new Logger(StoryRequestGateway.name);

  constructor() {}

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

  @SubscribeMessage('audio-story-request')
  async handleRequestAudioStory(
    audioRequestWithUserAudioDto: AudioRequestWithUserAudioDto,
  ): Promise<void> {
    this.logger.warn('STATUSES');

    const { sockets } = this.server.sockets;
    for (const [, client] of sockets) {
      const user: UserAccessDto = (client as SocketWithAuth).user;

      if (audioRequestWithUserAudioDto.userId === user.sub) {
        client.emit('audio-story-request', {
          ...JSON.parse(JSON.stringify(audioRequestWithUserAudioDto)),
        });
      }
    }
  }

  @SubscribeMessage('add-story-request')
  async handleRequestAddStory(
    addStoryRequestEntity: AddStoryRequestEntity,
  ): Promise<void> {
    this.logger.warn('ADD STORY REQUEST');
    console.log(addStoryRequestEntity);

    const { sockets } = this.server.sockets;
    for (const [, client] of sockets) {
      const user: UserAccessDto = (client as SocketWithAuth).user;

      if (addStoryRequestEntity.userId === user.sub) {
        client.emit('add-story-request', {
          ...JSON.parse(
            JSON.stringify(
              new AddStoryRequestDto(
                addStoryRequestEntity.id,
                addStoryRequestEntity.storyName,
                addStoryRequestEntity.status,
                addStoryRequestEntity.comment,
              ),
            ),
          ),
        });
      }
    }
  }
}
