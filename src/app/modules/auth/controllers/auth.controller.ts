import { BadRequestDto } from '@/common/dto/BadRequestDto';
import { BaseRequestExceptionDto } from '@/common/dto/BaseRequestExceptionDto';
import { UserAccess } from '@/app/modules/user/decorators/user.decorator';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';
import { SignInRequestDto } from '../dto/request/sign-in.request.dto';
import { SignUpRequestDto } from '../dto/request/sign-up.request.dto';
import { TokensResponseDto } from '../dto/response/tokens.response.dto';
import { Tokens } from '../types';
import { ValidationExceptionResponseDto } from '@/common/dto/response/validation-exception.response.dto';
import { CurrentUser } from '@/common/decorators/user.decorator';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('AuthController')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger('AuthController');

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'регистрация' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TokensResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: ValidationExceptionResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  signUp(@Body() dto: SignUpRequestDto): Promise<Tokens> {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'вход' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: TokensResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  signIn(@Body() dto: SignInRequestDto): Promise<Tokens> {
    return this.authService.signIn(dto);
  }

  @ApiOperation({ summary: ' на обновление access token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: TokensResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer refreshToken',
  })
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@CurrentUser() currentUser: JwtPayload) {
    return this.authService.refreshTokens(parseInt(currentUser.sub));
  }

  @ApiOperation({ summary: 'выход из системы' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: BadRequestDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: BaseRequestExceptionDto,
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() currentUser: JwtPayload) {
    return await this.authService.logout(parseInt(currentUser.sub));
  }
}
