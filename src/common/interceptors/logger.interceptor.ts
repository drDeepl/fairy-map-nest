import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request & { body: any }>();
    const response = ctx.getResponse<Response & { statusCode: number }>();

    const { method, url, headers, body } = request;
    const now = Date.now();

    this.logger.log(`Incoming Request: ${method} ${url}`);
    this.logger.debug(`Headers: ${JSON.stringify(headers)}`);
    this.logger.debug(`Request Body: ${JSON.stringify(body)}`);

    return next.handle().pipe(
      tap((responseBody) => {
        const { statusCode } = response;
        const contentLength = response.getHeader('content-length') || 0;
        const timeElapsed = Date.now() - now;

        this.logger.log(
          `Outgoing Response: ${method} ${url} ${statusCode} ${contentLength}b - ${timeElapsed}ms`,
        );
        this.logger.debug(`Response Body: ${JSON.stringify(responseBody)}`);
      }),
    );
  }
}
