import { PrismaService } from '@/prisma/prisma.service';
import { PCodeMessages, getUuid, uploadsPath } from '@/util/Constants';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { FileUtils } from '@/util/FileUtils';
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
import { UploadedUserAudioDto } from './dto/UploadedUserAudioDto';
import { UserAudioDto } from './dto/UserAudioDto';

@Injectable()
export class UserAudioService {
  private readonly logger = new Logger('UserAudioService');
  private readonly msgException = new MessageException();
  private readonly fileUtils = new FileUtils();
  private readonly dbExceptionHandler = new DataBaseExceptionHandler(
    PCodeMessages,
  );

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
        if (result) {
          const file = fs.createReadStream(
            join(process.cwd(), result.pathAudio),
          );
          return new StreamableFile(file);
        }
      });
  }

  async getAudiosByUserId(userId: number): Promise<UserAudioDto[]> {
    this.logger.debug('GET AUDIOS BY USER ID');
    return await this.prisma.userAudioStory
      .findMany({
        select: {
          id: true,
          name: true,
          languageId: true,
        },
        where: {
          userId: userId,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        throw this.dbExceptionHandler.handleError(error);
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
          'ошибка в объявлении параметров',
          HttpStatus.FORBIDDEN,
        );
      });
  }

  async saveAudio(
    userId: number,
    languageId: number,
    file: File,
  ): Promise<UploadedUserAudioDto> {
    this.logger.debug('SAVE AUDIO');
    const filename = file.originalname;
    const extens = extname(filename);
    const filenameFolder = `${languageId}@${getUuid(filename)}.${extens}`;
    const destination = `${uploadsPath}${userId}`;
    const pathAudio = `${destination}/${filenameFolder}`;

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
          pathAudio: pathAudio,
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
      })
      .then((result) => {
        const savedFile = fs.writeFileSync(pathAudio, file.buffer);
        console.log(savedFile);
        return result;
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
            // fs.unlinkSync(userAudio.pathAudio);
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
