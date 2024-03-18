import {
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserAudioService } from './user-audio.service';

import { Role, diskStorageOptionsAudio, validateAudio } from '@/util/Constants';

import { Roles } from '@/util/decorators/Roles';
import { RoleGuard } from '@/util/guards/role.guard';
import { Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { File, diskStorage } from 'multer';
import { BaseUserAudioDto } from './dto/BaseUserAudioDto';

@ApiTags('UserAudioController')
@Controller('api/user-audio')
export class UserAudioController {
  private readonly logger = new Logger('UserAudioController');

  constructor(private readonly userAudioService: UserAudioService) {}

  @ApiOperation({ summary: 'получение озвучки пользователя' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: BaseUserAudioDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:userAudioId')
  async getUserAudioById(
    @Param('userAudioId', ParseIntPipe) userAudioId: number,
  ) {
    this.logger.debug('GET USER AUDIO BY ID');
  }

  @ApiOperation({
    summary: 'добавление озвучки пользователя для выбранного языка',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: BaseUserAudioDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/upload/:languageId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage(diskStorageOptionsAudio),
      fileFilter: validateAudio,
    }),
  )
  async uploadUserAudio(
    @UploadedFile() file: File,
    @Req() req,
    @Param('languageId', ParseIntPipe) languageId: number,
  ) {
    this.logger.debug('UPLOAD USER AUDIO');
    console.log(file);
    if (file != undefined) {
      return this.userAudioService
        .saveAudio(file.originalname, file.path, req.user.sub, languageId)
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

  @ApiOperation({ summary: 'удаление озвучки пользователя' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: BaseUserAudioDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('/delete/:userAudioId')
  async deleteUserAudioById(
    @Param('userAudioId', ParseIntPipe) userAudioId: number,
  ) {
    this.logger.debug('DELETE USER AUDIO BY ID');
    return this.userAudioService
      .deleteUserAudioById(userAudioId)
      .catch((error) => {
        this.logger.error(error);
        throw new HttpException(error.message, error.status);
      })
      .then((result) => {});
  }
}
