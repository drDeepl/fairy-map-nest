import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
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

import { Role } from '@/util/Constants';
import { Roles } from '@/util/decorators/Roles';
import { RoleGuard } from '@/util/guards/role.guard';

import { UserAccess } from '../decorators/user.decorator';
import { UserResponseDto } from '../dto/response/user.response.dto';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '@/util/decorators/User';
import { JwtPayload } from '../../auth/interface/jwt-payload.interface';

import { UserAudioService } from '../../user-audio/services/user-audio.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'multer';
import { AudioStoryRequestService } from '../../audio-story-request/services/audio-story-request.service';
import { AudioApplicationWithUserAudioResponseDto } from '../../audio-story-request/dto/audio-story-request/audio-application-with-user-audio.dto';
import { UserAudioResponseDto } from '../../user-audio/dto/response/user-audio.response.dto';
import { AudioStoryResponseDto } from '../../story/dto/audio-story/response/audio-story.response.dto';

@ApiTags('UserController')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
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
    type: AudioStoryResponseDto,
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
  ): Promise<AudioStoryResponseDto[]> {
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
    return this.userService.findById(userId);
  }

  @ApiOperation({
    summary: 'загрузка озвучки пользователя',
    description: 'файл прикрепляется к полю audio',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: UserAudioResponseDto,
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
  @Post('/story/:storyId/language/:languageId/audio/upload')
  @UseInterceptors(FileInterceptor('audio'))
  async uploadUserAudio(
    @UploadedFile() file: File,
    @User() user: JwtPayload,
    @Param('languageId', ParseIntPipe) languageId: number,
    @Param('storyId', ParseIntPipe) storyId: number,
  ): Promise<UserAudioResponseDto> {
    console.log(file);
    return this.userAudioService.addUserAudio({
      storyId: storyId,
      languageId: languageId,
      filename: file.filename,
      userId: Number(user.sub),
      pathAudio: file.path,
    });
  }

  @ApiOperation({
    summary: 'получение всех заявок на озвучки текущего пользователя',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    isArray: true,
    type: AudioApplicationWithUserAudioResponseDto,
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
  ): Promise<AudioApplicationWithUserAudioResponseDto[]> {
    return this.audioStoryRequestService.getAudioRequestsByUserId(
      parseInt(user.sub),
    );
  }
}
