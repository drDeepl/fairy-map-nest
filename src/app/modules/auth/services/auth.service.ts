import { PrismaService } from '@/prisma/prisma.service';
import { PCodeMessages } from '@/util/Constants';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { MessageException } from '@/util/MessageException';
import { DataBaseExceptionHandler } from '@/util/exception/DataBaseExceptionHandler';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { SignInRequestDto } from '../dto/request/sign-in.request.dto';
import { SignUpRequestDto } from '../dto/request/sign-up.request.dto';
import { Tokens } from '../types';
import { JwtTokenOptions } from '@/config/interfaces/jwt-config.interface';
import { CreateJwt } from '../interface/create-jwt.interface';
import { Role, User } from '@prisma/client';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { UserRepository } from '../../user/repositories/user.repository';
import { UserService } from '../../user/services/user.service';
import { UserResponseDto } from '../../user/dto/response/user.response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly msgException = new MessageException();
  private readonly dbExceptionHandler = new DataBaseExceptionHandler(
    PCodeMessages,
  );

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async createJwt(payload: CreateJwt): Promise<Tokens> {
    const signOptions: JwtTokenOptions = this.configService.get(
      `jwt.${payload.role.toLowerCase()}`,
    );

    const jwt: Tokens = {
      accessToken: await this.jwtService.signAsync(payload, signOptions.access),
      refreshToken: await this.jwtService.signAsync(
        payload,
        signOptions.refresh,
      ),
    };
    return jwt;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: refreshToken,
      },
    });
  }

  async signUp(dto: SignUpRequestDto): Promise<Tokens> {
    const hashData = await this.hashData(dto.password);

    const user: UserResponseDto = await this.userService.findUserByEmail(
      dto.email,
    );

    if (user) {
      throw new ConflictException(
        'пользователь с такой электронной почтой уже существует',
      );
    }

    const newUser: User = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        passwordHash: hashData,
        role: Role.USER,
      },
    });

    const payload: CreateJwt = {
      sub: `${newUser.id}`,
      role: newUser.role,
    };

    const tokens = await this.createJwt(payload);
    this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(dto: SignInRequestDto): Promise<Tokens> {
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
      throw new BadRequestException('неверный пароль');
    }

    const payload: CreateJwt = {
      sub: `${user.id}`,
      role: user.role,
    };

    const tokens: Tokens = await this.createJwt(payload);
    this.updateRefreshToken(user.id, tokens.refreshToken);
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
          refreshToken: null,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        throw this.dbExceptionHandler.handleError(error);
      })
      .then((result) => {});
  }

  async refreshTokens(userId: number): Promise<Tokens> {
    const user: User | undefined = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ForbiddenException('Пользователь не найден');
    }

    if (!user.refreshToken) {
      throw new ForbiddenException('Refresh Token не найден');
    }

    const payload: CreateJwt = {
      sub: `${user.id}`,
      role: user.role,
    };

    const tokens: Tokens = await this.createJwt(payload);
    this.updateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  async validateJwtPayload(payload: JwtPayload): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        id: parseInt(payload.sub),
      },
    });
  }
}
