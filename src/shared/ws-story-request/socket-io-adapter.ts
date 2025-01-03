import { UserAccessDto } from '@/app/modules/user/dto/UserAccessDto';
import { UserService } from '@/app/modules/user/services/user.service';
import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
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

    const jwtService = this.app.get(JwtService);
    const usersService = this.app.get(UserService);
    const server: Server = super.createIOServer(port, optionsWithCORS);

    server.use(
      createTokenMiddleware(
        jwtService,
        usersService,
        this.logger,
        this.configService,
      ),
    );

    return server;
  }
}

const createTokenMiddleware =
  (
    jwtService: JwtService,
    usersService: UserService,
    logger: Logger,
    configService: ConfigService,
  ) =>
  async (socket: SocketWithAuth, next) => {
    try {
      logger.warn('CREATE TOKEN MIDDLEWARE');
      const token = socket.handshake.headers.authorization.split(' ')[1];
      logger.debug(`Validating auth token before connection: ${token}`);
      const payload = await jwtService.verify(token, {
        secret: configService.get('JWT_ACCESS_SECRET'),
      });
      socket.user = payload;
      next();
    } catch (error) {
      logger.error(error);
      next(new Error('FORBIDDEN'));
    }
  };
