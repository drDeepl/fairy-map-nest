import { Role } from '@/util/Constants';
import { Roles } from '@/util/decorators/Roles';

import { RoleGuard } from '@/util/guards/role.guard';
import { StoryRequestGateway } from '@/shared/ws-story/ws-story.gateway';
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
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AudioStoryRequestService } from '../services/audio-story-request.service';
import { AddAudioStoryApplicationDto } from '../dto/audio-story-request/request/AddAudioStoryRequestDto';

import { EditAudioStoryApplicaitonDto } from '../dto/audio-story-request/request/EditAudioStoryApplicaitonDto';
import { AudioStoryRequestEntity } from '../entity/AudioStoryApplicationtEntity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PageOptionsRequestDto } from '@/common/dto/request/page-options.request.dto';
import { PageResponseDto } from '@/common/dto/response/page.response.dto';
import { ApiPaginatedResponse } from '@/common/dto/response/api-paginated.response.dto';
import { AudioApplicationWithUserAudioResponseDto } from '../dto/audio-story-request/audio-application-with-user-audio.dto';

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
  @ApiPaginatedResponse(AudioApplicationWithUserAudioResponseDto)
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin, Role.moder)
  @Get('/all')
  async getAllAudioStoryRequests(
    @Query() query: PageOptionsRequestDto,
  ): Promise<PageResponseDto<AudioApplicationWithUserAudioResponseDto>> {
    return this.audioStoryRequestService.getAudioRequests(query);
  }

  @ApiOperation({
    summary: 'получение всех заявок на озвучки для выбранного пользователя.',
    description: 'Необходима роль модератора',
  })
  @ApiPaginatedResponse(AudioApplicationWithUserAudioResponseDto)
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
    @Query() query: PageOptionsRequestDto,
  ): Promise<PageResponseDto<AudioApplicationWithUserAudioResponseDto>> {
    return await this.audioStoryRequestService.getAudioRequestsByUserId(
      userId,
      query,
    );
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
    return await this.audioStoryRequestService.createAddAudioRequest(dto);
  }

  @ApiOperation({
    description:
      'необходима роль модератора или администратора. после редактирования, отредактированная запись по вебсокету отправляется пользователю из userId(создавшему заявку) в событие с названием "statuses"',
    summary: 'редактирование заявки на проверку озвучки',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AudioApplicationWithUserAudioResponseDto,
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
  ): Promise<AudioApplicationWithUserAudioResponseDto> {
    const editableAudioStoryRequest =
      await this.audioStoryRequestService.editAudioStoryRequest(
        audioStoryReqeustId,
        dto,
      );
    // await this.audioStoryRequestGateway.handleRequestAudioStory(
    //   editableAudioStoryRequest,
    // );
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
    return this.audioStoryRequestService.deleteAudioStoryById(
      audioStoryRequestId,
    );
  }
}
