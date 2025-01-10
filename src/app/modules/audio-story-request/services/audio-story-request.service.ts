import { PrismaService } from '@/prisma/prisma.service';
import { PCodeMessages } from '@/util/Constants';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { MessageException } from '@/util/MessageException';
import { DataBaseExceptionHandler } from '@/util/exception/DataBaseExceptionHandler';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotImplementedException,
} from '@nestjs/common';
import { Status } from '@prisma/client';
import { AddAudioStoryApplicationDto } from '../dto/audio-story-request/request/AddAudioStoryRequestDto';
import { AudioApplicationWithUserAudioResponseDto } from '../dto/audio-story-request/audio-application-with-user-audio.dto';
import { EditAudioStoryApplicaitonDto } from '../dto/audio-story-request/request/EditAudioStoryApplicaitonDto';
import { AudioStoryRequestEntity } from '../entity/AudioStoryApplicationtEntity';
import { UserAudioWithLanguageResponseDto } from '../dto/audio-story-request/response/user-audio.response.dto';
import { ConfigService } from '@nestjs/config';
import { prepareSrcAudio } from '@/common/helpers/path-upload';
import { AuthorAudioStoryResponseDto } from '../../user/dto/response/author-audio-story.response.dto';
import { PageOptionsRequestDto } from '@/common/dto/request/page-options.request.dto';
import { PageResponseDto } from '@/common/dto/response/page.response.dto';
import { PageMetaDto } from '@/common/dto/page-meta.dto';
import { LanguageDto } from '../../ethnic-group/dto/LanguageDto';

@Injectable()
export class AudioStoryRequestService {
  private readonly logger = new Logger('AudioStoryRequestService');
  private readonly msgException = new MessageException();
  private readonly dbExceptionHandler = new DataBaseExceptionHandler(
    PCodeMessages,
  );

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createAddAudioRequest(
    dto: AddAudioStoryApplicationDto,
  ): Promise<AudioStoryRequestEntity> {
    const addAudioStory = await this.prisma.storyAudioRequest.findFirst({
      where: {
        userAudioId: dto.userAudioId,
        userId: dto.userId,
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
          storyId: dto.storyId,
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
    dto: EditAudioStoryApplicaitonDto,
  ): Promise<AudioApplicationWithUserAudioResponseDto> {
    this.logger.debug('EDIT AUDIO STORY REQUEST');

    if (!Status[dto.status]) {
      throw new BadRequestException('неверный статус для заявки');
    }

    const updatedAppllication = await this.prisma.storyAudioRequest.update({
      select: {
        id: true,
        user: true,

        userAudio: {
          select: {
            id: true,
            name: true,
            originalName: true,
            language: true,
          },
        },
        status: true,
        story: true,
        comment: true,
      },
      where: { id: id },
      data: {
        status: dto.status as Status,
        comment: dto.comment,
      },
    });

    const appUrl = String(this.configService.get('APP_URL'));

    const srcAudio: string = prepareSrcAudio({
      appUrl: appUrl,
      storyId: updatedAppllication.story.id,
      userId: updatedAppllication.user.id,
      languageId: updatedAppllication.userAudio.language.id,
      filename: updatedAppllication.userAudio.name,
    });

    return new AudioApplicationWithUserAudioResponseDto({
      ...updatedAppllication,
      storyId: updatedAppllication.story.id,
      storyName: updatedAppllication.story.name,
      user: new AuthorAudioStoryResponseDto(updatedAppllication.user),
      userAudio: new UserAudioWithLanguageResponseDto({
        ...updatedAppllication.userAudio,
        srcAudio: srcAudio,
        language: Object.assign(
          new LanguageDto(),
          updatedAppllication.userAudio.language,
        ),
      }),
    });

    throw new NotImplementedException('editAudioStoryRequest');

    // return await this.prisma.storyAudioRequest
    //   .update({
    //     select: {
    //       id: true,
    //       userId: true,
    //       userAudio: { select: { id: true, name: true } },
    //       typeRequest: true,
    //       status: true,
    //       storyId: true,
    //       comment: true,
    //     },
    //     where: {
    //       id: id,
    //     },
    //     data: {
    //       status: Status[dto.status],
    //       comment: dto.comment,
    //     },
    //   })
    //   .catch((error) => {
    //     PrintNameAndCodePrismaException(error, this.logger);
    //     throw this.dbExceptionHandler.handleError(error);
    //   });
  }

  async deleteAudioStoryById(id: number) {
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

  async getAudioRequests(
    query: PageOptionsRequestDto,
  ): Promise<PageResponseDto<AudioApplicationWithUserAudioResponseDto>> {
    const [storyAudioRequests, itemCount] = await this.prisma.$transaction([
      this.prisma.storyAudioRequest.findMany({
        skip: query.skip,
        take: query.take,
        select: {
          id: true,
          user: true,

          userAudio: {
            select: {
              id: true,
              name: true,
              originalName: true,
              language: true,
            },
          },
          status: true,
          story: true,
          comment: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.storyAudioRequest.count(),
    ]);

    const appUrl = String(this.configService.get('APP_URL'));

    const dto = storyAudioRequests.map((request) => {
      const srcAudio: string = prepareSrcAudio({
        appUrl: appUrl,
        storyId: request.story.id,
        userId: request.user.id,
        languageId: request.userAudio.language.id,
        filename: request.userAudio.name,
      });

      return new AudioApplicationWithUserAudioResponseDto({
        ...request,
        storyId: request.story.id,
        storyName: request.story.name,
        user: new AuthorAudioStoryResponseDto(request.user),
        userAudio: new UserAudioWithLanguageResponseDto({
          ...request.userAudio,
          srcAudio: srcAudio,
          language: Object.assign(
            new LanguageDto(),
            request.userAudio.language,
          ),
        }),
      });
    });
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: query, itemCount });

    return new PageResponseDto(dto, pageMetaDto);
  }
  catch(error) {
    PrintNameAndCodePrismaException(error, this.logger);
    throw this.dbExceptionHandler.handleError(error);
  }

  async getAudioRequestsByUserId(
    userId: number,
  ): Promise<AudioApplicationWithUserAudioResponseDto[]> {
    try {
      const storyAudioRequests = await this.prisma.storyAudioRequest.findMany({
        select: {
          id: true,
          userId: true,
          userAudio: { select: { id: true, name: true, languageId: true } },
          typeRequest: true,
          status: true,
          story: true,
          createdAt: true,
          updatedAt: true,
          comment: true,
        },
        where: {
          userId: userId,
        },
        orderBy: { createdAt: 'desc' },
      });

      const appUrl = String(this.configService.get('APP_URL'));

      return storyAudioRequests.map((request) => {
        const srcAudio: string = prepareSrcAudio({
          appUrl: appUrl,
          storyId: request.story.id,
          userId: userId,
          languageId: request.userAudio.languageId,
          filename: request.userAudio.name,
        });

        return new AudioApplicationWithUserAudioResponseDto({
          ...request,
          storyId: request.story.id,
          storyName: request.story.name,
          userAudio: new UserAudioWithLanguageResponseDto({
            ...request.userAudio,
            srcAudio: srcAudio,
          }),
        });
      });
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }
}
