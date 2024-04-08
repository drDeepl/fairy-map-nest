import { PrismaService } from '@/prisma/prisma.service';
import { PCodeMessages } from '@/util/Constants';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { MessageException } from '@/util/MessageException';
import { DataBaseExceptionHandler } from '@/util/exception/DataBaseExceptionHandler';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Status } from '@prisma/client';
import { AddAudioStoryRequestDto } from './dto/audio-story-request/AddAudioStoryRequestDto';
import { AudioRequestWithUserAudioDto } from './dto/audio-story-request/AudioRequestWithUserAudioDto';
import { EditAudioStoryRequestDto } from './dto/audio-story-request/EditAudioStoryRequestDto';
import { AudioStoryRequestEntity } from './entity/AudioStoryRequestEntity';

@Injectable()
export class AudioStoryRequestService {
  private readonly logger = new Logger('AudioStoryRequestService');
  private readonly msgException = new MessageException();
  private readonly dbExceptionHandler = new DataBaseExceptionHandler(
    PCodeMessages,
  );

  constructor(private readonly prisma: PrismaService) {}

  async createAddAudioRequest(
    dto: AddAudioStoryRequestDto,
  ): Promise<AudioStoryRequestEntity> {
    // FIX: CREATE ENUM STATUS OR STORE IN DB?
    this.logger.debug('CREATE ADD AUDIO REQUEST');
    console.log(Status);
    const addAudioStory = await this.prisma.storyAudioRequest.findFirst({
      where: {
        userAudioId: dto.userAudioId,
        userId: dto.userId,
        typeId: dto.typeId,
      },
    });

    if (addAudioStory) {
      throw new HttpException(
        'Заявка с выбранными параметрами уже создана',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.prisma.storyAudioRequest
      .create({
        data: {
          userId: dto.userId,
          userAudioId: dto.userAudioId,
          status: Status.SEND,
          typeId: dto.typeId,
          comment: '',
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        throw this.dbExceptionHandler.handleError(error);
      });
  }

  async editAudioStoryRequest(
    id: number,
    dto: EditAudioStoryRequestDto,
  ): Promise<AudioRequestWithUserAudioDto> {
    this.logger.debug('EDIT AUDIO STORY REQUEST');

    return await this.prisma.storyAudioRequest
      .update({
        select: {
          id: true,
          userId: true,
          userAudio: { select: { id: true, name: true } },
          typeId: true,
          status: true,
          comment: true,
        },
        where: {
          id: id,
        },
        data: {
          status: Status[dto.status],
          comment: dto.comment,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        throw this.dbExceptionHandler.handleError(error);
      });
  }

  async deleteAudioStoryById(id: number) {
    this.logger.debug('DELETE AUDIO STORY BY ID');
    try {
      await this.prisma.storyAudioRequest.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }

  async getAudioRequestsByUserId(
    id: number,
  ): Promise<AudioRequestWithUserAudioDto[]> {
    this.logger.debug('GET AUDIO REQUESTS BY USER ID');
    return await this.prisma.storyAudioRequest
      .findMany({
        select: {
          id: true,
          userId: true,
          userAudio: { select: { id: true, name: true } },
          typeId: true,
          status: true,
          comment: true,
        },
        where: {
          userId: id,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        throw this.dbExceptionHandler.handleError(error);
      });
  }
}
