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
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MessageResponseDto } from '../../../../common/dto/response/message.response.dto';
import { Role } from '@/util/Constants';
import { Roles } from '@/util/decorators/Roles';
import { RoleGuard } from '@/util/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserAccess } from '../decorators/user.decorator';
import { UserResponseDto } from '../dto/response/user.response.dto';
import { UserService } from '../services/user.service';

@ApiTags('UserController')
@UseGuards(AuthGuard('jwt'))
@Controller('api/user')
export class UserController {
  private readonly logger = new Logger('USER.CONTROLLER');

  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @ApiOperation({ summary: 'получение информации о текущем пользователе' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.FORBIDDEN)
  getCurrentUserInfo(
    @UserAccess() userAccessTokenData,
  ): Promise<UserResponseDto> {
    this.logger.verbose('GET CURRENT USER INFO');
    const userId = userAccessTokenData.sub;
    return this.userService.findById(userId);
  }

  @Get('/:userId')
  @ApiOperation({
    summary: 'получение информации о пользователе по его id',
    description: 'необходима роль администратора',
  })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  findUserById(@Param('userId') userId: number): Promise<UserResponseDto> {
    this.logger.verbose('findUserById');
    return this.userService.findById(userId);
  }

  @Delete('delete/:userId')
  @ApiOperation({
    summary: 'удаленеи пользователя по его id',
    description: 'необходима роль администратора',
  })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  deleteUser(
    @Param('userId', ParseIntPipe) userId: number,
    @UserAccess() userAccessTokenData,
  ): Promise<MessageResponseDto> {
    this.logger.verbose('deleteUser');
    if (userId === userAccessTokenData.sub || userAccessTokenData.isAdmin) {
      return this.userService.deleteUser(userId);
    }
    throw new HttpException('недостаточно прав', HttpStatus.FORBIDDEN);
  }
}
