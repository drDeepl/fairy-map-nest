import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthRefresh extends AuthGuard('refresh-jwt') {
  private readonly logger = new Logger(JwtAuthRefresh.name);

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw new UnauthorizedException('Неавторизован');
    }

    return user;
  }
}
