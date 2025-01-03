import { Role } from '@/util/Constants';
import { Roles } from '@/util/decorators/Roles';

import { RoleGuard } from '@/util/guards/role.guard';
import { StoryRequestGateway } from '@/shared/ws-story-request/ws-story-request.gateway';
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

import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AudioStoryRequestService } from '../services/audio-story-request.service';
import { AddAudioStoryApplicationDto } from '../dto/audio-story-request/request/AddAudioStoryRequestDto';
import { AudioApplicationWithUserAudioDto } from '../dto/audio-story-request/AudioApplicationWithUserAudioDto';
import { EditAudioStoryApplicaitonDto } from '../dto/audio-story-request/request/EditAudioStoryApplicaitonDto';
import { AudioStoryRequestEntity } from '../entity/AudioStoryApplicationtEntity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('AudioStoryRequestController')
@Controller('audio-story-request')
export class AudioStoryRequestController {
  private readonly logger = new Logger('RequestAudioStoryController');
  constructor(
    private audioStoryRequestService: AudioStoryRequestService,
    private readonly audioStoryRequestGateway: StoryRequestGateway,
  ) {}

  @ApiOperation({
    summary: 'получение всех заявок на озвучки',
    description: 'необходимы роль модератора',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AudioApplicationWithUserAudioDto,
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin, Role.moder)
  @Get('/all')
  async getAllAudioStoryRequests(): Promise<
    AudioApplicationWithUserAudioDto[]
  > {
    return this.audioStoryRequestService.getAudioRequests();
  }

  @ApiOperation({
    summary: 'получение всех заявок на озвучки для выбранного пользователя.',
    description: 'Необходима роль модератора',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [AudioStoryRequestEntity],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin, Role.moder)
  @Get('/by-user/:userId')
  async getAllAudioStoryReqeustsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<AudioApplicationWithUserAudioDto[]> {
    this.logger.debug('GET ALL AUDIO STORY REQEUSTS BY USER ID');
    return await this.audioStoryRequestService.getAudioRequestsByUserId(userId);
  }

  @ApiOperation({ summary: 'Создание заявки на проверку озвучки' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AudioStoryRequestEntity,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('/add')
  async createAddAudioRequest(
    @Body() dto: AddAudioStoryApplicationDto,
  ): Promise<AudioStoryRequestEntity> {
    this.logger.debug('CREATE ADD AUDIO STORY REQUEST');
    return await this.audioStoryRequestService.createAddAudioRequest(dto);
  }

  @ApiOperation({
    description:
      'необходима роль модератора. после редактирования, отредактированная запись по вебсокету отправляется пользователю из userId(создавшему заявку) в событие с названием "statuses"',
    summary: 'редактирование заявки на проверку озвучки',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AudioStoryRequestEntity,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin, Role.moder)
  @Put('/edit/:audioStoryReqeustId')
  async editAudioStoryRequest(
    @Param('audioStoryReqeustId', ParseIntPipe) audioStoryReqeustId: number,
    @Body() dto: EditAudioStoryApplicaitonDto,
  ): Promise<AudioApplicationWithUserAudioDto> {
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
    description: 'необходима роль администратора',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin, Role.moder)
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
