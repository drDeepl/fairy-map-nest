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
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MessageResponseDto } from '../../../../common/dto/response/message.response.dto';
import { Role } from '@/util/Constants';
import { Roles } from '@/util/decorators/Roles';
import { RoleGuard } from '@/util/guards/role.guard';

import { UserAccess } from '../decorators/user.decorator';
import { UserResponseDto } from '../dto/response/user.response.dto';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '@/util/decorators/User';
import { JwtPayload } from '../../auth/interface/jwt-payload.interface';
import { ApprovedUserAudioDto } from '../../user-audio/dto/ApprovedUserAudioDto';
import { UserAudioService } from '../../user-audio/services/user-audio.service';
import { UserAudioDto } from '../../user-audio/dto/UserAudioDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'multer';
import { AudioStoryRequestService } from '../../audio-story-application/services/audio-story-request.service';
import { AudioApplicationWithUserAudioDto } from '../../audio-story-application/dto/audio-story-request/AudioApplicationWithUserAudioDto';
import { AudioStoryRequestEntity } from '../../audio-story-application/entity/AudioStoryRequestEntity';

@ApiTags('UserController')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly userAudioService: UserAudioService,
    private readonly audioStoryRequestService: AudioStoryRequestService,
  ) {}

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
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.FORBIDDEN)
  getCurrentUserInfo(
    @UserAccess() userAccessTokenData,
  ): Promise<UserResponseDto> {
    const userId = userAccessTokenData.sub;
    return this.userService.findById(userId);
  }

  @ApiOperation({
    summary: 'получение одобренных озвучек текущего пользователя',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: ApprovedUserAudioDto,
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/audio/approved/my')
  async getApprovedUserAudiosCurrentUser(
    @User() user: JwtPayload,
  ): Promise<ApprovedUserAudioDto[]> {
    return await this.userAudioService.getApprovedUserAudiosCurrentUser(
      parseInt(user.sub),
    );
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
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  findUserById(@Param('userId') userId: number): Promise<UserResponseDto> {
    this.logger.verbose('findUserById');
    return this.userService.findById(userId);
  }

  @ApiOperation({
    summary: 'загрузка озвучки пользователя для выбранного языка',
    description: 'в теле запроса(body) файл прикрепляется к полю file',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: UserAudioDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/audio/upload/:languageId')
  @UseInterceptors(FileInterceptor('audio'))
  async uploadUserAudio(
    @UploadedFile() file: File,
    @Req() req,
    @Param('languageId', ParseIntPipe) languageId: number,
  ) {
    if (file != undefined) {
      return await this.userAudioService
        .saveAudio(req.user.sub, languageId, file)
        .catch((error) => {
          throw new HttpException(error.message, HttpStatus.FORBIDDEN);
        });
    } else {
      throw new HttpException(
        'поле с файлом не может быть пустым',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @ApiOperation({
    summary: 'получение всех заявок на озвучки текущего пользователя',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    isArray: true,
    type: AudioApplicationWithUserAudioDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('story/audio/request/my')
  async getAllAudioStoryRequestsCurrentUser(
    @User() user: JwtPayload,
  ): Promise<AudioApplicationWithUserAudioDto[]> {
    return this.audioStoryRequestService.getAudioRequestsByUserId(
      parseInt(user.sub),
    );
  }
}
