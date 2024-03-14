import {
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserAudioService } from './user-audio.service';
import { ConstituentDto } from '@/constituent/dto/ConstituentDto';
import { Role } from '@/util/Constants';
import { Roles } from '@/util/decorators/Roles';
import { RoleGuard } from '@/util/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { BaseUserAudioDto } from './dto/BaseUserAudioDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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
  @Post('/upload/:userId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploaded-user-audios',
        filename: (req, file, cb) => {
          console.log(req);
          return cb(null, file.originalname);
        },
      }),
    }),
  )
  async uploadUserAudio(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'audio/mpeg',
        })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    audio,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    this.logger.debug('UPLOAD USER AUDIO');
    // this.userAudioService.saveAudio(audio, userId);
  }
}
