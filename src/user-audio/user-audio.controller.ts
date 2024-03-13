import {
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
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
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserAudio(@UploadedFile() audio) {
    this.logger.debug('UPLOAD USER AUDIO');
    console.log(audio);
  }
}
