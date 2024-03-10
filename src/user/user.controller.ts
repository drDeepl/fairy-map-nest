import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MessageDto } from '@/dto/MessageDto';
import { AuthGuard } from '@nestjs/passport';
import { UserAccess } from './decorators/user.decorator';
import { UserDto } from './dto/UserDto';
import { UserService } from './user.service';

@ApiTags('UserController')
@UseGuards(AuthGuard('jwt'))
@Controller('api/user')
export class UserController {
  private readonly logger = new Logger('USER.CONTROLLER');

  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @ApiOperation({ summary: 'получение информации о текущем пользователе' })
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.FORBIDDEN)
  getCurrentUserInfo(@UserAccess() userAccessTokenData): Promise<UserDto> {
    this.logger.verbose('GET CURRENT USER INFO');
    const userId = userAccessTokenData.sub;
    return this.userService.findById(userId);
  }

  @Get('/:userId')
  @ApiOperation({ summary: 'get user by id' })
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  findUserById(@Param('userId') userId: number): Promise<UserDto> {
    this.logger.verbose('findUserById');
    return this.userService.findById(userId);
  }

  @Delete('delete/:userId')
  @ApiOperation({ summary: 'delete user by id' })
  @ApiResponse({ status: HttpStatus.OK, type: UserDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  deleteUser(
    @Param('userId', ParseIntPipe) userId: number,
    @UserAccess() userAccessTokenData,
  ): Promise<MessageDto> {
    this.logger.verbose('deleteUser');
    if (userId === userAccessTokenData.sub || userAccessTokenData.isAdmin) {
      return this.userService.deleteUser(userId);
    }
    throw new HttpException('недостаточно прав', HttpStatus.FORBIDDEN);
  }
}
