import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('access-jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err: any, user: any, info: any) {
    this.logger.debug(this.handleRequest.name);

    if (err || !user) {
      throw new UnauthorizedException('Неавторизован');
    }

    return user;
  }
}
