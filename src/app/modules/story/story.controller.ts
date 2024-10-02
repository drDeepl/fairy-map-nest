import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StoryService } from './story.service';

import { UserAccessInterface } from '@/app/modules/auth/interface/UserAccessInterface';
import { Role } from '@/util/Constants';
import { Roles } from '@/util/decorators/Roles';
import { User } from '@/util/decorators/User';
import { RoleGuard } from '@/util/guards/role.guard';
import { validatorImgFile } from '@/util/validators/validators';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { File, memoryStorage } from 'multer';
import { AddAudioStoryDto } from './dto/audio-story/AddAudioStoryDto';
import { AudioStoryLanguageDto } from './dto/audio-story/AudioStoryLanguageDto';
import { CreatedImageStoryDto } from './dto/image-story/CreatedImageStory';
import { ImageStoryDto } from './dto/image-story/ImageStoryDto';
import { AddRatingAudioStoryDto } from './dto/rating-audio-story/AddRatingAudioStoryDto';
import { AddedRatingAudioStoryDto } from './dto/rating-audio-story/AddedRatingAudioStoryDto';
import { RatingAudioStoryDto } from './dto/rating-audio-story/RatingAudioStoryDto';
import { AddStoryDto } from './dto/story/AddStoryDto';
import { EditStoryDto } from './dto/story/EditStoryDto';
import { StoryDto } from './dto/story/StoryDto';
import { AddTextStoryDto } from './dto/text-story/AddTextStoryDto';
import { TextStoryDto } from './dto/text-story/TextStoryDto';
import { RatingAudioStoryEntity } from './entity/rating-audio-story/RatingAudioStoryEntity';

@ApiTags('StoryController')
@Controller('api/story')
export class StoryController {
  private readonly logger = new Logger('StoryController');
  constructor(private readonly storyService: StoryService) {}

  @ApiOperation({ summary: 'получение всех сказок' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [StoryDto],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Get('/all')
  async getAllStories() {
    this.logger.debug('GET ALL STORIES');
    return this.storyService.getStories();
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
    this.logger.debug('GET STORY BY ID');
    return await this.storyService.getStoryById(storyId);
  }

  @ApiOperation({
    summary: 'получение доступных языков озвучки для выбранной сказки',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AudioStoryLanguageDto,
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Get('languages/:storyId')
  async getLanguagesForCurrentStory(
    @Param('storyId', ParseIntPipe) storyId: number,
  ): Promise<AudioStoryLanguageDto[]> {
    this.logger.debug('GET LANGUAGES FOR CURRENT STORY BY STORY ID');
    return await this.storyService.getLanguagesForStory(storyId);
  }

  @ApiOperation({
    summary: 'получение всех сказок выбранной этнической группы',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [StoryDto],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Get('/ethnic-group/:ethnicGroupId')
  async getStoriesByEthnicGroupId(
    @Param('ethnicGroupId', ParseIntPipe) ethnicGroupId: number,
  ): Promise<StoryDto[]> {
    this.logger.debug('GET STORIES BY ETHNIC GROUP ID');
    return this.storyService.getStoriesByEthnicGroup(ethnicGroupId);
  }

  @ApiOperation({
    summary: 'добавление сказки',
    description: 'необходима роль администратора',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: StoryDto,
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
  @Post('/add')
  async addStory(@Body() dto: AddStoryDto) {
    this.logger.debug('ADD STORY');
    return this.storyService.addStory(dto);
  }

  @ApiOperation({
    summary: 'редактирование сказки',
    description: 'необходима роль администратора',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: StoryDto,
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
  @Put('/edit/:storyId')
  async editSotry(
    @Param('storyId', ParseIntPipe) storyId: number,
    @Body() dto: EditStoryDto,
  ) {
    this.logger.debug('EDIT SOTRY');
    return this.storyService.editStory(storyId, dto);
  }

  @ApiOperation({
    summary: 'удаление сказки',
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
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('/delete/:storyId')
  async deleteStoryById(@Param('storyId', ParseIntPipe) storyId: number) {
    this.logger.debug('DELETE STORY BY ID');
    return this.storyService
      .deleteStoryById(storyId)
      .catch((error) => {
        throw new HttpException(error.message, error.status);
      })
      .then((result) => {});
  }

  @ApiOperation({
    summary: 'добавление текста сказки',
    description: 'небходима роль администратора',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: TextStoryDto,
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
  @Post('/text/add/:storyId')
  async addTextStory(
    @Param('storyId', ParseIntPipe) storyId,
    @Body() dto: AddTextStoryDto,
  ) {
    this.logger.debug('ADD TEXT STORY');
    return this.storyService.addTextStory(storyId, dto);
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
    this.logger.debug('GET TEXT STORY BY ID');
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
  @Get('/audio/:audioId')
  async getAudioStoryById(
    @Param('audioId', ParseIntPipe) audioId: number,
  ): Promise<StreamableFile> {
    this.logger.debug('GET STORIES BY ETHNIC GROUP ID');
    return this.storyService.getAudioStoryById(audioId);
  }

  @ApiOperation({
    summary: 'добавление озвучки к сказке',
    description:
      'пример запроса: /api/story/audio?storyId=8 | необходима роль администратора',
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
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put('/audio')
  async setUserAudioToStory(
    @Query('storyId', ParseIntPipe) storyId: number,
    @Body() dto: AddAudioStoryDto,
    @User() user: UserAccessInterface,
  ): Promise<void> {
    this.logger.debug('SET USER AUDIO TO STORY');
    return this.storyService.setUserAudioToStory(user.sub, storyId, dto);
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
  @Get('/image/:storyId')
  async getImgStoryById(
    @Param('storyId', ParseIntPipe) storyId: number,
    @Res() response,
  ) {
    this.logger.debug('GET IMAGE STORY BY ID');
    try {
      const file = await this.storyService.getImgStoryById(storyId);
      response.set({
        'Content-Disposition': `attachment; filename=${file.filename}`,
      });
      response.send(file.buffer);
    } catch (error) {
      response.send(new HttpException(error.message, error.status));
    }
  }

  @ApiOperation({
    summary: 'загрузка обложки для выбранной сказки',
    description: 'необходима роль администратора',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: CreatedImageStoryDto,
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
  @Put('/image/upload/:storyId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: validatorImgFile,
    }),
  )
  async uploadStoryImage(
    @UploadedFile() file: File,
    @Req() req,
    @Param('storyId', ParseIntPipe) storyId: number,
  ) {
    this.logger.debug('UPLOAD STORY IMAGE');
    return await this.storyService.setImgForStory(storyId, file);
  }

  @ApiOperation({
    summary: 'удаление обложки для выбранной сказки по storyId',
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
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('/image/delete/:storyId')
  async deleteStoryImgByStoryId(
    @Param('storyId', ParseIntPipe) storyId: number,
  ): Promise<void> {
    this.logger.debug('DELETE STORY IMG BY STORY ID');
    await this.storyService.deleteStoryImgByStoryId(storyId);
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
    this.logger.debug('GET RATING BY AUDIO ID');
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
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/rating/my/:userAudioId')
  async getRatingByAudioIdForCurrentUser(
    @User() user: UserAccessInterface,
    @Param('userAudioId', ParseIntPipe) userAudioId: number,
  ): Promise<RatingAudioStoryEntity> {
    this.logger.debug('GET RATING AUDIO ID FOR CURRENT USER');
    return await this.storyService.getRatingByAudioIdForCurrentUser(
      user.sub,

      userAudioId,
    );
  }

  @ApiOperation({
    summary: 'добавление текущим пользователем оценки к озвучке по audioId',
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
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Put('/rating/add')
  async addRatingForStoryByCurrentUser(
    @User() user: UserAccessInterface,
    @Body() dto: AddRatingAudioStoryDto,
  ): Promise<AddedRatingAudioStoryDto> {
    this.logger.debug('ADD RATING FOR STORY BY CURRENT USER');
    return await this.storyService.addRatingAudioStoryById(user.sub, dto);
  }
}
