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
import { StoryService } from '@/app/modules/story/services/story.service';
import { SearchStoryOptionsRequestDto } from '@/app/modules/story/dto/story/request/search-story-options.request.dto';

@WebSocketGateway(3002, { cors: true, transports: ['websocket'] })
export class StoryRequestGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private readonly logger: Logger = new Logger(StoryRequestGateway.name);

  constructor(private readonly storyService: StoryService) {}

  afterInit(server: Server): void {
    this.logger.warn('Init');
  }

  handleDisconnect(client: Socket): void {
    this.logger.warn(`Client disconnected: ${client.id}`);
  }

  handleConnection(@ConnectedSocket() client: SocketWithAuth): void {
    const { sockets } = this.server.sockets;

    this.logger.warn(`Client connected: ${client.id}`);

    this.logger.debug(
      `Number of connected notification clients: ${sockets.size}`,
    );
  }

  @SubscribeMessage('audioStoryApplication')
  async handleRequestAudioStory(
    audioRequestWithUserAudioDto: AudioApplicationWithUserAudioResponseDto,
  ): Promise<void> {
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

  @SubscribeMessage('addStoryRequest')
  async handleRequestAddStory(
    addStoryRequestEntity: AddStoryRequestEntity,
  ): Promise<void> {
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

  /**
   * отправляет результаты поиска сказки по имени
   * @param client - WebSocket client instance
   * @param payload - SearchStoryOptionsRequestDto
   * @example
   * // Server-to-client event: 'searchStoryByName'
   * // response: {
   *               "data": [
   *                 {
   *                 "name": "тестовая сказка #1",
   *                 "id": 2,
   *                 "ethnicGroup": {
   *                   "id": 103,
   *                   "name": "Поляки",
   *                   "languageId": 119
   *                 },
   *                 "text": "dadawdawdaw",
   *                 "srcImg": null
   *               },
   *              ],
   *             "meta": {
   *               "page": 1,
   *               "take": 10,
   *               "itemCount": 91,
   *               "pageCount": 10,
   *               "hasPreviousPage": false,
   *               "hasNextPage": true
   *             }
   *   }
   */
  @SubscribeMessage('searchStoryByName')
  async handleSearchStoryByName(
    client: any,
    payload: SearchStoryOptionsRequestDto,
  ) {
    const results = await this.storyService.searchStoryByName(payload);
    client.emit('searchResultStoryByName', results);
  }
}
