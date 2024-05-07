import { PrismaService } from '@/prisma/prisma.service';
import { PCodeMessages, Role } from '@/util/Constants';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { MessageException } from '@/util/MessageException';
import { DataBaseExceptionHandler } from '@/util/exception/DataBaseExceptionHandler';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  private readonly msgException = new MessageException();
  private readonly dbExceptionHandler = new DataBaseExceptionHandler(
    PCodeMessages,
  );

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, role: string = Role.admin): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          role,
        },
        {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get('JWT_ACCESS_EXP'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          role,
        },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXP'),
        },
      ),
    ]);
    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async updateHashRefreshToken(userId: number, refreshToken: string) {
    this.logger.verbose('updateRefreshToken');
    const hashData: string = await this.hashData(refreshToken);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshTokenHash: hashData,
      },
    });
  }

  async signUp(dto: SignUpDto, role: string = 'user'): Promise<Tokens> {
    this.logger.verbose('signUp');
    try {
      const hashData = await this.hashData(dto.password);
      const newUser = await this.prisma.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          passwordHash: hashData,
          role: role,
        },
      });
      const tokens = await this.getTokens(newUser.id, newUser.role);
      this.updateHashRefreshToken(newUser.id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new HttpException(
            'пользователь с такой электронной почтой уже существует',
            HttpStatus.FORBIDDEN,
          );
        }
        throw new HttpException(
          'произошла ошибка в работе базы данных',
          HttpStatus.BAD_GATEWAY,
        );
      } else {
        throw new HttpException(
          this.msgException.UnhandledError,
          HttpStatus.BAD_GATEWAY,
        );
      }
    }
  }

  async signIn(dto: SignInDto): Promise<Tokens> {
    this.logger.verbose('signIn');

    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new NotFoundException('данного пользователя не существует');
    }
    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new ForbiddenException('неверный пароль');
    }
    const tokens = await this.getTokens(user.id, user.role);
    this.updateHashRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number) {
    this.logger.verbose('logout');
    return this.prisma.user
      .update({
        where: {
          id: userId,
        },
        data: {
          refreshTokenHash: null,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        throw this.dbExceptionHandler.handleError(error);
      })
      .then((result) => {});
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<Tokens> {
    this.logger.verbose('refreshTokens');
    this.logger.verbose(`${userId}`);
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    console.log(user);
    if (!user) {
      throw new ForbiddenException('Пользователь не найден');
    }

    if (!user.refreshTokenHash) {
      throw new ForbiddenException('Refresh Token не найден');
    }

    const comparedRefreshToken = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );
    if (!comparedRefreshToken) {
      throw new ForbiddenException('Не соответствие токена');
    }

    const tokens = await this.getTokens(user.id, user.role);
    this.updateHashRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }
}
