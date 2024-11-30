import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export class DataBaseExceptionHandler {
  codeMessage: object;

  constructor(codeMessage: object) {
    this.codeMessage = codeMessage;
  }

  handleError(
    error: Prisma.PrismaClientKnownRequestError | HttpException,
  ): HttpException {
    if (error instanceof HttpException) {
      return error;
    }

    if (error.name === 'NotFoundException') {
      throw new NotFoundException();
    }
    if (this.codeMessage[error.code] === undefined) {
      return new HttpException('Что-то пошло не так', HttpStatus.BAD_REQUEST);
    }
    return new HttpException(
      this.codeMessage[error.code],
      HttpStatus.FORBIDDEN,
    );
  }
}
