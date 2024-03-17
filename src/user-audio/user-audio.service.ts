import { PrismaService } from '@/prisma/prisma.service';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { MessageException } from '@/util/MessageException';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
const fs = require('fs');


@Injectable()
export class UserAudioService {
  private readonly logger = new Logger('UserAudioService');
  private readonly msgException = new MessageException();

  constructor(private prisma: PrismaService) {}

  async saveAudio(
    filename: string,
    destination: string,
    userId: number,
    languageId: number,
  ) {
    this.logger.debug('SAVE AUDIO');
    return this.prisma.userAudioStory
      .create({
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
      })
      .then((result) => {});
  }

  async deleteUserAudioById(id: number){
    this.logger.debug("DELETE USER AUDIO BY ID");
    this.prisma.userAudioStory.findUnique({
      where:{
        id: id
      }
    })
    .catch(error => {
      PrintNameAndCodePrismaException(error, this.logger);
      if (error.code === 'P2003') {
        throw new HttpException(
          'аудиозапись не найдена',
          HttpStatus.FORBIDDEN,
        );
      } else {
        throw new HttpException(
          this.msgException.UnhandledError,
          HttpStatus.BAD_GATEWAY,
        );
      }
    })
    .then(result => {
      console.log(result)
    })
  }
}
