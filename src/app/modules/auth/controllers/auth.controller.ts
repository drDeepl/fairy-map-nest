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
import { AuthGuard } from '@nestjs/passport';
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

@ApiTags('AuthController')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger('AuthController');
  constructor(private readonly authService: AuthService) {}
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
    this.logger.log('auth.controller: signIn');
    return this.authService.signIn(dto);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'регистрация' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TokensResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  signUp(@Body() dto: SignUpRequestDto): Promise<Tokens> {
    return this.authService.signUp(dto);
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
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Req() req: Request) {
    this.logger.verbose('refresh');
    const user = req.user;
    return this.authService.refreshTokens(user['sub'], user['refreshToken']);
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
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@UserAccess() userAccessData) {
    return await this.authService.logout(userAccessData['sub']);
  }
}
