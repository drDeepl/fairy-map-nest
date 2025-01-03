import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { Role, User } from '@prisma/client';
import { AccessJwtStrategy } from './access-jwt.strategy';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  private readonly logger = new Logger(RefreshJwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        const secret: string = this.getSecretKey(rawJwtToken);

        done(null, secret);
      },
    });
  }

  async validate(payload: JwtPayload) {
    const user: User | undefined =
      await this.authService.validateJwtPayload(payload);

    if (!user) {
      throw new UnauthorizedException(
        'Не удалось войти в систему с предоставленными данными',
      );
    }

    return payload;
  }

  private getSecretKey(rawJwtToken: string): string {
    const payload: JwtPayload = this.decodeJwt(rawJwtToken);

    switch (payload.role) {
      case Role.ADMIN: {
        return this.configService.get(
          `jwt.${Role.ADMIN.toLowerCase()}.access.secret`,
        );
      }
      case Role.MODER: {
        return this.configService.get(
          `jwt.${Role.MODER.toLowerCase()}.access.secret`,
        );
      }
      case Role.USER: {
        return this.configService.get(
          `jwt.${Role.USER.toLowerCase()}.access.secret`,
        );
      }
      default: {
        throw new UnauthorizedException('Неверная роль пользователя');
      }
    }
  }

  decodeJwt(token: string): JwtPayload {
    try {
      const [, payload] = token.split('.');
      const decodedPayload = Buffer.from(payload, 'base64').toString('utf8');

      return JSON.parse(decodedPayload) as JwtPayload;
    } catch (error) {
      throw new ConflictException('неверный формат токена');
    }
  }
}
