import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';

export type SocketWithAuth = {
  user: any;
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

    this.logger.log('Configuring SocketIO server with custom CORS options', {
      cors,
    });

    const optionsWithCORS: ServerOptions = {
      ...options,
      cookie: true,
      cors,
    };

    const jwtService = this.app.get(JwtService);
    const server: Server = super.createIOServer(port, optionsWithCORS);

    server.use(
      createTokenMiddleware(jwtService, this.logger, this.configService),
    );

    return server;
  }
}

const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger, configService: ConfigService) =>
  async (socket: SocketWithAuth, next) => {
    try {
      const token = socket.handshake.auth.Authorization.split(' ')[1];
      logger.debug(`Validating auth token before connection: ${token}`);
      const payload = jwtService.verify(token);
      socket.user = payload;
      next();
    } catch {
      next(new Error('FORBIDDEN'));
    }
  };
