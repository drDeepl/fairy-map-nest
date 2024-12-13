import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaErrorFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.log(exception);

    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();

    let message = exception.message.replace(/\n/g, '');
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        message = 'выюранная запись уже существует';
        break;
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = 'выбранной записи не существует';
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = 'Запись не найдена';
        break;

      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'что-то пошло не так';
    }

    response.status(status).json({
      statusCode: status,
      message,
      errorCode: exception.code,
    });
  }
}
