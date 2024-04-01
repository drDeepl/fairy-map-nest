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
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StoryService } from './story.service';

import { Role } from '@/util/Constants';
import { Roles } from '@/util/decorators/Roles';
import { RoleGuard } from '@/util/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { AddStoryDto } from './dto/AddStoryDto';
import { StoryDto } from './dto/StoryDto';
import { EditStoryDto } from './dto/EditStoryDto';
import { AddTextStoryDto } from './dto/AddTextStoryDto';
import { TextStoryDto } from './dto/TextStoryDto';

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

  @ApiOperation({
    summary: 'добавление озвучки к сказке',
    description:
      'пример запроса /api/audio/param?audioStoryRequestId=0&storyId=1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put('/audio/param')
  async setUserAudioToStory(
    @Query('audioStoryRequestId', ParseIntPipe) audioStoryRequestId: number,
    @Query('storyId', ParseIntPipe) storyId: number,
  ): Promise<void> {
    this.logger.debug('SET USER AUDIO TO STORY');
    return this.storyService.setUserAudioToStory(audioStoryRequestId, storyId);
  }
}
