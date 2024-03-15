import {
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserAudioService } from './user-audio.service';

import { Role, diskStorageOptions, validateAudio } from '@/util/Constants';

import { RoleGuard } from '@/util/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { BaseUserAudioDto } from './dto/BaseUserAudioDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, File } from 'multer';

@ApiTags('UserAudioController')
@Controller('api/user-audio')
export class UserAudioController {
  private readonly logger = new Logger('UserAudioController');

  constructor(private readonly userAudioService: UserAudioService) {}

  @ApiOperation({ summary: 'добавление озвучки пользователя' })
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
      storage: diskStorage(diskStorageOptions),
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
    return this.userAudioService.saveAudio(
      file.filename,
      file.destination,
      req.user.sub,
      languageId,
    );
  }
}
