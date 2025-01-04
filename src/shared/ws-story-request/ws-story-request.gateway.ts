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
import { SocketWithAuth } from './socket-io-adapter';

import { UserAccessDto } from '@/app/modules/user/dto/UserAccessDto';
import { AddStoryRequestEntity } from '@/app/modules/add-story-request/entity/AddStoryRequestEntity';
import { AddStoryRequestDto } from '@/app/modules/add-story-request/dto/AddStoryRequestDto';
import { AudioApplicationWithUserAudioResponseDto } from '@/app/modules/audio-story-request/dto/audio-story-request/audio-application-with-user-audio.dto';

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

  @SubscribeMessage('audio-story-application')
  async handleRequestAudioStory(
    audioRequestWithUserAudioDto: AudioApplicationWithUserAudioResponseDto,
  ): Promise<void> {
    this.logger.warn('STATUSES');

    const { sockets } = this.server.sockets;
    for (const [, client] of sockets) {
      const user: UserAccessDto = (client as SocketWithAuth).user;

      if (audioRequestWithUserAudioDto.user.id === user.sub) {
        client.emit('audio-story-application', {
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
