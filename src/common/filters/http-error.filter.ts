import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ValidationException } from './validation.exception';
import { HttpErrorPayload } from './interfaces/http-error-payload.interface';

type HttpError = HttpException | ValidationException;

@Catch(HttpException, ValidationException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpError, host: ArgumentsHost): any {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const payload: HttpErrorPayload = {
      statusCode: exception.getStatus(),
      message: exception.message,
    };

    if (exception instanceof ValidationException) {
      payload.validationErrors = exception.errors;
    }
    return response.status(exception.getStatus()).json(payload);
  }
}
