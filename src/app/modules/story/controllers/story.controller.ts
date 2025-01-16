import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StoryService } from '../services/story.service';
import { JwtPayload } from '@/app/modules/auth/interface/jwt-payload.interface';
import { User } from '@/util/decorators/User';
import { RoleGuard } from '@/util/guards/role.guard';
import { Response } from 'express';
import { ImageStoryDto } from '../dto/image-story/ImageStoryDto';
import { AddRatingAudioStoryDto } from '../dto/rating-audio-story/AddRatingAudioStoryDto';
import { AddedRatingAudioStoryDto } from '../dto/rating-audio-story/AddedRatingAudioStoryDto';
import { RatingAudioStoryDto } from '../dto/rating-audio-story/RatingAudioStoryDto';
import { StoryDto } from '../dto/story/StoryDto';
import { TextStoryDto } from '../dto/text-story/TextStoryDto';
import { RatingAudioStoryEntity } from '../entity/rating-audio-story/RatingAudioStoryEntity';
import { MessageResponseDto } from '@/common/dto/response/message.response.dto';
import { ConfigService } from '@nestjs/config';
import { StoryBookResponseDto } from '../dto/story/response/story-with-img.response.dto';
import { AudioStoryResponseDto } from '../dto/audio-story/response/audio-story.response.dto';
import { PreviewAudioStoryResponseDto } from '../dto/audio-story/response/preview-audio-story.response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiPaginatedResponse } from '@/common/dto/response/api-paginated.response.dto';
import { PageResponseDto } from '@/common/dto/response/page.response.dto';
import { PageOptionsRequestDto } from '@/common/dto/request/page-options.request.dto';

@ApiTags('StoryController')
@Controller('story')
export class StoryController {
  private readonly logger = new Logger('StoryController');
  constructor(
    private readonly storyService: StoryService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'получение всех сказок' })
  @ApiPaginatedResponse(StoryBookResponseDto)
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Get('/all')
  async getAllStories(
    @Query() query: PageOptionsRequestDto,
  ): Promise<PageResponseDto<StoryBookResponseDto>> {
    return this.storyService.getStories(query);
  }

  @ApiOperation({ summary: 'получение сказок, которые озвучил пользователь' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    isArray: true,
    type: StoryBookResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Get('/audio/user/:userId')
  async getStoriesByAuthorAudioStory(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<StoryBookResponseDto[]> {
    return this.storyService.getStoriesByAuthorAudioStory(userId);
  }

  @ApiOperation({ summary: 'получение сказок в которых есть подстрока name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: StoryDto,
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Get('/by-name/:name')
  async getStoryByName(@Param('name') storyName: string): Promise<StoryDto[]> {
    this.logger.debug('GET STORY BY NAME');
    return await this.storyService.getStoryByName(storyName);
  }

  @ApiOperation({ summary: 'получение общей информации о выбранной сказке' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: StoryDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Get('/:storyId')
  async getStoryById(
    @Param('storyId', ParseIntPipe) storyId: number,
  ): Promise<StoryDto> {
    return await this.storyService.getStoryById(storyId);
  }

  @ApiOperation({
    summary: 'получение одобренных озвучек для выбранной сказки',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AudioStoryResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Get('/:storyId/audio/all')
  async getAudiosByStoryId(@Param('storyId', ParseIntPipe) storyId: number) {
    return this.storyService.getAudiosForStory(storyId);
  }

  @ApiOperation({
    summary: 'получение всех сказок выбранной этнической группы',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    isArray: true,
    type: StoryBookResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Get('/ethnic-group/:ethnicGroupId')
  async getStoriesByEthnicGroupId(
    @Param('ethnicGroupId', ParseIntPipe) ethnicGroupId: number,
  ): Promise<StoryBookResponseDto[]> {
    return this.storyService.getStoriesByEthnicGroup(ethnicGroupId);
  }

  @ApiOperation({ summary: 'получение текста сказки' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: TextStoryDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @HttpCode(HttpStatus.OK)
  @Get('/text/:storyId')
  async getTextStoryByStoryId(
    @Param('storyId', ParseIntPipe) storyId: number,
  ): Promise<TextStoryDto> {
    return await this.storyService.getTextByStoryId(storyId);
  }

  @ApiOperation({
    summary: 'получение одобренной озвучки по audioId',
    description: 'возвращает StreamableFile',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: StreamableFile,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Get('/audio/:storyAudioId')
  async getAudioStoryById(
    @Param('storyAudioId', ParseIntPipe) storyAudioId: number,
  ): Promise<StreamableFile> {
    return this.storyService.getAudioStoryById(storyAudioId);
  }

  @ApiOperation({
    summary: 'получение аудиокниг для выбранной этнической группы',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    isArray: true,
    type: PreviewAudioStoryResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Get('/audio/ethnic-group/:ethnicGroupId')
  async getAudioStoryByEthnicGroup(
    @Param('ethnicGroupId', ParseIntPipe) ethnicGroupId: number,
  ): Promise<PreviewAudioStoryResponseDto[]> {
    return this.storyService.getAudiosByEthnicGroup(ethnicGroupId);
  }

  @ApiOperation({
    summary: 'получение обложки для сказки по storyId',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: ImageStoryDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Image not found' })
  @HttpCode(HttpStatus.OK)
  @Get('/:storyId/image/:filename')
  async getImgStoryById(
    @Param('storyId') storyId: string,
    @Param('filename') fileName: string,
    @Res() res: Response,
  ) {
    const filePath = `${this.configService.get('uploads.imgPath')}\\${storyId}\\${fileName}`;

    return res.sendFile(filePath, (err) => {
      if (err) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json(new MessageResponseDto('изображение не найдено'));
      }
    });
  }

  @ApiOperation({
    summary: 'получение оценки для выбранной озвучки',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: RatingAudioStoryDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get('/rating/:audioId')
  async getRatingByAudioId(
    @Param('audioId', ParseIntPipe) audioId: number,
  ): Promise<RatingAudioStoryDto> {
    return await this.storyService.getRatingByAudioId(audioId);
  }

  @ApiOperation({
    summary: 'получение оценки для выбранной озвучки для текущего пользователя',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: RatingAudioStoryDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/rating/my/:userAudioId')
  async getRatingByAudioIdForCurrentUser(
    @User() user: JwtPayload,
    @Param('userAudioId', ParseIntPipe) userAudioId: number,
  ): Promise<RatingAudioStoryEntity> {
    return await this.storyService.getRatingByAudioIdForCurrentUser(
      parseInt(user.sub),
      userAudioId,
    );
  }

  @ApiOperation({
    summary: 'добавление текущим пользователем оценки к озвучке по audioId',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AddedRatingAudioStoryDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/rating/add')
  async addRatingForStoryByCurrentUser(
    @User() user: JwtPayload,
    @Body() dto: AddRatingAudioStoryDto,
  ): Promise<AddedRatingAudioStoryDto> {
    return await this.storyService.addRatingAudioStoryById(
      parseInt(user.sub),
      dto,
    );
  }
}
