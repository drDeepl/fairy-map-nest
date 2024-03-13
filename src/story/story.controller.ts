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


  
}
