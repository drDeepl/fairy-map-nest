import { UserAccessInterface } from '@/auth/interface/UserAccessInterface';
import { Role } from '@/util/Constants';
import { Roles } from '@/util/decorators/Roles';
import { User } from '@/util/decorators/User';
import { RoleGuard } from '@/util/guards/role.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StoryRequestGateway } from '@/ws-story-request/ws-story-request.gateway';
import { AudioStoryRequestService } from './audio-story-request.service';
import { AddAudioStoryRequestDto } from './dto/audio-story-request/AddAudioStoryRequestDto';
import { AudioRequestWithUserAudioDto } from './dto/audio-story-request/AudioRequestWithUserAudioDto';
import { EditAudioStoryRequestDto } from './dto/audio-story-request/EditAudioStoryRequestDto';
import { AudioStoryRequestEntity } from './entity/AudioStoryRequestEntity';

@ApiTags('AudioStoryRequestController')
@Controller('api/audio-story-request')
export class AudioStoryRequestController {
  private readonly logger = new Logger('RequestAudioStoryController');
  constructor(
    private audioStoryRequestService: AudioStoryRequestService,
    private readonly audioStoryRequestGateway: StoryRequestGateway,
  ) {}

  @ApiOperation({
    summary: 'получение всех заявок на озвучки текущего пользователя',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [AudioStoryRequestEntity],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('/my-audio-story-requests')
  async getAllAudioStoryRequestsCurrentUser(
    @User() user: UserAccessInterface,
  ): Promise<AudioRequestWithUserAudioDto[]> {
    this.logger.debug('GET ALL AUDIO STORY REQUESTS FOR CURRENT USER');
    return this.audioStoryRequestService.getAudioRequestsByUserId(user.sub);
  }

  @ApiOperation({ summary: 'Создание заявки на проверку озвучки' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AudioStoryRequestEntity,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('/add')
  async createAddAudioRequest(
    @Body() dto: AddAudioStoryRequestDto,
  ): Promise<AudioStoryRequestEntity> {
    this.logger.debug('CREATE ADD AUDIO STORY REQUEST');
    return await this.audioStoryRequestService.createAddAudioRequest(dto);
  }

  @ApiOperation({
    description:
      'после редактирования, отредактированная запись по вебсокету отправляется пользователю из userId(создавшему заявку) в событие с названием "statuses"',
    summary: 'редактирование заявки на проверку озвучки',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AudioStoryRequestEntity,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put('/edit/:audioStoryReqeustId')
  async editAudioStoryRequest(
    @Param('audioStoryReqeustId', ParseIntPipe) audioStoryReqeustId: number,
    @Body() dto: EditAudioStoryRequestDto,
  ): Promise<AudioRequestWithUserAudioDto> {
    const editableAudioStoryRequest =
      await this.audioStoryRequestService.editAudioStoryRequest(
        audioStoryReqeustId,
        dto,
      );
    await this.audioStoryRequestGateway.handleRequestAudioStory(
      editableAudioStoryRequest,
    );
    return editableAudioStoryRequest;
  }

  @ApiOperation({
    summary: 'удаление заявки на проверку озвучки',
    description: 'Требования: пользователь является администратором',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Delete('/delete/:audioStoryRequestId')
  async deleteAudioStoryRequestBydId(
    @Param('audioStoryRequestId', ParseIntPipe) audioStoryRequestId: number,
  ) {
    this.logger.debug('DELETE AUDIO STORY REQEUST BY ID');
    return this.audioStoryRequestService.deleteAudioStoryById(
      audioStoryRequestId,
    );
  }
}
