import { UserAccessDto } from '@/app/modules/user/dto/UserAccessDto';

import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';

export type SocketWithAuth = {
  user: UserAccessDto;
} & Socket;

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  private configService: ConfigService;
  constructor(private app: INestApplicationContext) {
    super(app);
    this.configService = app.get(ConfigService);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const cors = {
      origin: '*',
    };

    const optionsWithCORS: ServerOptions = {
      ...options,
      cookie: true,
      cors,
    };

    const server: Server = super.createIOServer(port, optionsWithCORS);

    server.use(createTokenMiddleware(this.logger));

    return server;
  }
}

const createTokenMiddleware =
  (logger: Logger) => async (socket: SocketWithAuth, next) => {
    try {
      logger.log(createTokenMiddleware.name);
      next();
    } catch (error) {
      logger.error(error);
      next(new Error('FORBIDDEN'));
    }
  };
