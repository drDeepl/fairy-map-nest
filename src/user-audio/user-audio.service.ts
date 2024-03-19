import { PrismaService } from '@/prisma/prisma.service';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { FileUtils } from '@/util/FileUtils';
import { MessageException } from '@/util/MessageException';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream, unlink, unlinkSync } from 'fs';

import { BaseUserAudioDto } from './dto/BaseUserAudioDto';
import { UploadedUserAudioDto } from './dto/UploadedUserAudioDto';
import { UserAudioDto } from './dto/UserAudioDto';
import { join } from 'path';

@Injectable()
export class UserAudioService {
  private readonly logger = new Logger('UserAudioService');
  private readonly msgException = new MessageException();
  private readonly fileUtils = new FileUtils();

  constructor(private prisma: PrismaService) {}

  async getUserAudioById(userAudioId: number): Promise<StreamableFile> {
    this.logger.debug('GET USER AUDIO BY ID');
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
        const file = createReadStream(join(process.cwd(), result.pathAudio));
        return new StreamableFile(file);
      });
  }

  async findUserAudioByParams(params: object) {
    return this.prisma.userAudioStory
      .findFirst({
        where: params,
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        throw new HttpException(
          'озвучка с заданными параметрами не найдена',
          HttpStatus.FORBIDDEN,
        );
      });
  }

  async saveAudio(
    filename: string,
    destination: string,
    userId: number,
    languageId: number,
  ): Promise<UploadedUserAudioDto> {
    this.logger.debug('SAVE AUDIO');
    return this.prisma.userAudioStory
      .create({
        select: {
          id: true,
          name: true,
          languageId: true,
        },
        data: {
          name: filename,
          userId: userId,
          languageId: languageId,
          pathAudio: destination,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        if (error.code === 'P2003') {
          throw new HttpException(
            'выбранного языка не существует',
            HttpStatus.FORBIDDEN,
          );
        } else {
          throw new HttpException(
            this.msgException.UnhandledError,
            HttpStatus.BAD_GATEWAY,
          );
        }
      });
  }

  async deleteUserAudioById(id: number) {
    this.logger.debug('DELETE USER AUDIO BY ID');
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
            unlinkSync(userAudio.pathAudio);
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
