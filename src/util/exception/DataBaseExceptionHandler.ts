import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export class DataBaseExceptionHandler {
  codeMessage: object;

  constructor(codeMessage: object) {
    this.codeMessage = codeMessage;
  }

  handleError(error: Prisma.PrismaClientKnownRequestError): HttpException {
    if (this.codeMessage[error.code] === undefined) {
      return new HttpException('Что-то пошло не так', HttpStatus.BAD_GATEWAY);
    }
    return new HttpException(
      this.codeMessage[error.code],
      HttpStatus.FORBIDDEN,
    );
  }
}
