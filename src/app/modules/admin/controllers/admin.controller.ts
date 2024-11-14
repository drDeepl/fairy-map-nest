import { Roles } from '@/util/decorators/Roles';
import { RoleGuard } from '@/util/guards/role.guard';
import {
  Controller,
  Logger,
  HttpStatus,
  UseGuards,
  HttpCode,
  Post,
  Param,
  ParseIntPipe,
  Body,
  Delete,
  HttpException,
  Get,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { Role } from '@/util/Constants';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { AddEthnicGroupMapDto } from '../../map/dto/AddEthnicGroupMapDto';
import { EthnicGroupMapDto } from '../../map/dto/EthnicGroupMapDto';
import { MapService } from '../../map/services/map.service';
import { StoryService } from '../../story/story.service';
import { AuthGuard } from '@nestjs/passport';
import { AddStoryDto } from '../../story/dto/story/AddStoryDto';
import { EditStoryDto } from '../../story/dto/story/EditStoryDto';
import { StoryDto } from '../../story/dto/story/StoryDto';
import { AddTextStoryDto } from '../../story/dto/text-story/AddTextStoryDto';
import { TextStoryDto } from '../../story/dto/text-story/TextStoryDto';

@ApiTags('AdminController')
@Controller('admin')
export class AdminController {
  private readonly logger = new Logger('StoryController');
  constructor(
    private readonly mapService: MapService,
    private readonly storyService: StoryService,
  ) {}

  @ApiOperation({
    summary: 'добавление точки этнической группы на карту',
    description: 'необходима роль администратора',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: EthnicGroupMapDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @HttpCode(HttpStatus.OK)
  @Post('/ethnic-groups/:ethnicGroupId/constituents/:constituentId')
  async addEthnicalGroupPoint(
    @Param('ethnicGroupId', ParseIntPipe) ethnicGroupId: number,
    @Param('constituentId', ParseIntPipe) constituentId: number,
    @Body() dto: AddEthnicGroupMapDto,
  ): Promise<EthnicGroupMapDto> {
    return this.mapService.addEthnicalGroupPoint(
      ethnicGroupId,
      constituentId,
      dto,
    );
  }

  @ApiOperation({
    summary: 'удаление точки этнической группы',
    description: 'необходима роль администратора',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: EthnicGroupMapDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @HttpCode(HttpStatus.OK)
  @Delete('/ethnic-groups/:pointId')
  async deleteEthnicalGroupPoint(
    @Param('pointId', ParseIntPipe) pointId: number,
  ) {
    return this.mapService
      .deleteEthnicalGroupPoint(pointId)
      .catch((error) => {
        throw new HttpException(error.message, error.status);
      })
      .then((result) => {});
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
  @Post('story/add')
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
  @Put('story/edit/:storyId')
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
  @Delete('story/delete/:storyId')
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
  @Post('story/text/add/:storyId')
  async addTextStory(
    @Param('storyId', ParseIntPipe) storyId,
    @Body() dto: AddTextStoryDto,
  ) {
    this.logger.debug('ADD TEXT STORY');
    return this.storyService.addTextStory(storyId, dto);
  }
}
