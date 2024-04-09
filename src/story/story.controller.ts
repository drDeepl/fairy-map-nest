import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StoryService } from './story.service';

import { Role, diskStorageImg } from '@/util/Constants';
import { Roles } from '@/util/decorators/Roles';
import { RoleGuard } from '@/util/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { AddStoryDto } from './dto/story/AddStoryDto';
import { StoryDto } from './dto/story/StoryDto';
import { EditStoryDto } from './dto/story/EditStoryDto';
import { AddTextStoryDto } from './dto/text-story/AddTextStoryDto';
import { TextStoryDto } from './dto/text-story/TextStoryDto';
import { AddAudioStoryDto } from './dto/audio-story/AddAudioStoryDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage, File } from 'multer';
import { validatorImgFile } from '@/util/validators/validators';
import { CreatedImageStoryDto } from './dto/image-story/CreatedImageStory';
import { ImageStoryDto } from './dto/image-story/ImageStoryDto';
import { UserAccessInterface } from '@/auth/interface/UserAccessInterface';
import { User } from '@/util/decorators/User';
import { AddedRatingAudioStoryDto } from './dto/rating-audio-story/AddedRatingAudioStoryDto';
import { AddRatingAudioStoryDto } from './dto/rating-audio-story/AddRatingAudioStoryDto';
import { RatingAudioStoryDto } from './dto/rating-audio-story/RatingAudioStoryDto';

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

  @ApiOperation({ summary: 'добавление сказки' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: StoryDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/add')
  async addStory(@Body() dto: AddStoryDto) {
    this.logger.debug('ADD STORY');
    return this.storyService.addStory(dto);
  }

  @ApiOperation({ summary: 'редактирование сказки' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: StoryDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
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

  @ApiOperation({ summary: 'удаление сказки' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
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

  @ApiOperation({ summary: 'добавление текста сказки' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: TextStoryDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
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
    // FIX: GET USER AUDIO FILE
    @Param('audioId', ParseIntPipe) audioId: number,
  ): Promise<StreamableFile> {
    this.logger.debug('GET STORIES BY ETHNIC GROUP ID');
    return this.storyService.getAudioStoryById(audioId);
  }

  @ApiOperation({
    summary: 'добавление озвучки к сказке',
    description: 'пример запроса: /api/story/audio?storyId=8',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put('/audio')
  async setUserAudioToStory(
    @Query('storyId', ParseIntPipe) storyId: number,
    @Body() dto: AddAudioStoryDto,
  ): Promise<void> {
    this.logger.debug('SET USER AUDIO TO STORY');
    return this.storyService.setUserAudioToStory(storyId, dto);
  }

  @ApiOperation({
    summary: 'получение обложки для сказки по storyId',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: CreatedImageStoryDto,
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
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: CreatedImageStoryDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
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
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
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
    summary: 'добавление текущим пользователем оценки к озвучке по audioId',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
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
