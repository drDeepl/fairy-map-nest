import { PrismaService } from '@/prisma/prisma.service';
import { PCodeMessages, getUuid, uploadsPath } from '@/util/Constants';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';

import { MessageException } from '@/util/MessageException';
import { DataBaseExceptionHandler } from '@/util/exception/DataBaseExceptionHandler';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  StreamableFile,
} from '@nestjs/common';
import { File } from 'multer';
import * as fs from 'node:fs';
import { extname, join } from 'path';

import { UploadedUserAudioDto } from '../dto/UploadedUserAudioDto';
import { AddUserAudioParams } from '../interfaces/add-user-audio-params.interface';
import { UserAudioResponseDto } from '../dto/response/user-audio.response.dto';
import { prepareSrcAudio } from '@/common/helpers/path-upload';
import { ConfigService } from '@nestjs/config';
import { AudioStoryResponseDto } from '../../story/dto/audio-story/response/audio-story.response.dto';
import { AuthorAudioStoryResponseDto } from '../../user/dto/response/author-audio-story.response.dto';
import { LanguageDto } from '../../ethnic-group/dto/LanguageDto';

@Injectable()
export class UserAudioService {
  private readonly logger = new Logger('UserAudioService');
  private readonly msgException = new MessageException();
  private readonly dbExceptionHandler = new DataBaseExceptionHandler(
    PCodeMessages,
  );

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getUserAudioById(userAudioId: number): Promise<StreamableFile> {
    return this.prisma.userAudioStory
      .findUnique({
        select: {
          id: true,
          name: true,
          languageId: true,
          pathAudio: true,
        },
        where: {
          id: userAudioId,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        throw new HttpException(
          this.msgException.UnhandledError,
          HttpStatus.BAD_REQUEST,
        );
      })
      .then((result) => {
        if (result) {
          const file = fs.createReadStream(
            join(process.cwd(), result.pathAudio),
          );
          return new StreamableFile(file);
        }
      });
  }

  async getApprovedUserAudiosCurrentUser(
    userId: number,
  ): Promise<AudioStoryResponseDto[]> {
    try {
      const approvedAudios = await this.prisma.storyAudio.findMany({
        select: {
          id: true,
          userAudio: true,
          authors: true,
          story: {
            select: {
              id: true,
              name: true,
              ethnicGroup: true,
            },
          },
        },
        where: {
          author: userId,
        },
      });
      const appUrl = this.configService.get('APP_URL');

      return approvedAudios.map(
        (approvedAudio) =>
          new AudioStoryResponseDto({
            ...approvedAudio,
            srcAudio: prepareSrcAudio({
              appUrl: appUrl,
              storyId: approvedAudio.story.id,
              userId: approvedAudio.userAudio.userId,
              languageId: approvedAudio.userAudio.languageId,
              filename: approvedAudio.userAudio.name,
            }),
            author: new AuthorAudioStoryResponseDto(approvedAudio.authors),
          }),
      );
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }

  async getAudiosByUserId(userId: number): Promise<UserAudioResponseDto[]> {
    try {
      const userAudios = await this.prisma.userAudioStory.findMany({
        where: {
          userId: userId,
        },
      });
      const appUrl = String(this.configService.get('APP_URL'));

      return userAudios.map((userAudio) => {
        const relativePath = userAudio.pathAudio.split('/static/');
        const srcAudio = `${appUrl}/${relativePath[1]}`;
        return new UserAudioResponseDto({
          ...userAudio,
          userAudioId: userAudio.id,
          srcAudio: srcAudio,
        });
      });
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }

  async findUserAudioByParams(params: object) {
    return this.prisma.userAudioStory
      .findFirst({
        where: params,
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        throw new HttpException(
          'ошибка в объявлении параметров',
          HttpStatus.FORBIDDEN,
        );
      });
  }

  async addUserAudio(
    params: AddUserAudioParams,
  ): Promise<UserAudioResponseDto> {
    const userAudio = await this.prisma.userAudioStory.create({
      select: {
        id: true,
        userId: true,
        language: true,
        name: true,
        originalName: true,
      },
      data: {
        name: params.filename,
        originalName: params.originalName,
        userId: params.userId,
        languageId: params.languageId,
        pathAudio: params.pathAudio,
      },
    });

    const appUrl = String(this.configService.get('APP_URL'));
    const srcAudio = prepareSrcAudio({
      appUrl: appUrl,
      storyId: params.storyId,
      userId: userAudio.userId,
      languageId: userAudio.language.id,
      filename: userAudio.name,
    });

    return new UserAudioResponseDto({
      userAudioId: userAudio.id,
      srcAudio: srcAudio,
      language: Object.assign(new LanguageDto(), userAudio.language),
      originalName: userAudio.originalName,
    });
  }

  async deleteUserAudioById(id: number) {
    return this.prisma.userAudioStory
      .findUnique({
        where: {
          id: id,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        throw new HttpException(
          this.msgException.UnhandledError,
          HttpStatus.BAD_GATEWAY,
        );
      })
      .then((userAudio) => {
        if (userAudio) {
          try {
            fs.unlinkSync(userAudio.pathAudio);
            this.prisma.userAudioStory
              .delete({
                where: {
                  id: userAudio.id,
                },
              })
              .catch((error) => {
                PrintNameAndCodePrismaException(error, this.logger);
                throw new HttpException(
                  'ошибка при удалении озвучки',
                  HttpStatus.FORBIDDEN,
                );
              });
          } catch (error) {
            this.logger.error(`type:${error.code}\n${error}`);
            throw new HttpException(
              'ошибка при удалении озвучки',
              HttpStatus.FORBIDDEN,
            );
          }
        } else {
          throw new HttpException(
            'Озвучка для сказки не найдена',
            HttpStatus.FORBIDDEN,
          );
        }
      });
  }

  async getAudio(userId: number, languageId: number): Promise<StreamableFile> {
    this.logger.debug('GET USER AUDIO');
    return;
  }
}
