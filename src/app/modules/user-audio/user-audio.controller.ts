import {
  Controller,
  Delete,
  Header,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Put,
  Req,
  StreamableFile,
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
import { UserAudioService } from './user-audio.service';

import { JwtPayload } from '@/app/modules/auth/interface/jwt-payload.interface';
import { Role, validateAudio } from '@/util/Constants';
import { Roles } from '@/util/decorators/Roles';
import { User } from '@/util/decorators/User';
import { RoleGuard } from '@/util/guards/role.guard';
import { Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { File, memoryStorage } from 'multer';
import { ApprovedUserAudioDto } from './dto/ApprovedUserAudioDto';
import { BaseUserAudioDto } from './dto/BaseUserAudioDto';
import { UserAudioDto } from './dto/UserAudioDto';

@ApiTags('UserAudioController')
@Controller('user-audio')
export class UserAudioController {
  private readonly logger = new Logger('UserAudioController');

  constructor(private readonly userAudioService: UserAudioService) {}

  @ApiOperation({ summary: 'получение озвучек текущего пользователя' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: UserAudioDto,
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/my-audios')
  async getCurrentUserAudios(
    @User() user: JwtPayload,
  ): Promise<UserAudioDto[]> {
    this.logger.debug('GET CURRENT USER AUDIOS');
    return await this.userAudioService.getAudiosByUserId(parseInt(user.sub));
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
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/my-audios/approved')
  async getApprovedUserAudiosCurrentUser(
    @User() user: JwtPayload,
  ): Promise<ApprovedUserAudioDto[]> {
    this.logger.debug('GET CURRENT USER AUDIOS');
    return await this.userAudioService.getApprovedUserAudiosCurrentUser(
      parseInt(user.sub),
    );
  }

  @ApiOperation({ summary: 'получение файла озвучки пользователя' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: StreamableFile,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @HttpCode(HttpStatus.OK)
  @Get('/:userAudioId')
  @Header('Content-Type', 'application/mpeg')
  @Header('Content-Disposition', 'inline')
  async getUserAudioById(
    @Param('userAudioId', ParseIntPipe) userAudioId: number,
  ): Promise<StreamableFile> {
    this.logger.debug('GET USER AUDIO BY ID');
    return await this.userAudioService.getUserAudioById(userAudioId);
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
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Put('/upload/:languageId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
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
    // .saveAudio(file.originalname, file.path, req.user.sub, languageId, file)
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
    summary: 'удаление озвучки пользователя',
    description: 'необходима роль администратора',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: BaseUserAudioDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('/delete/:userAudioId')
  async deleteUserAudioById(
    @Req() req,
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
