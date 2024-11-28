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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { Role } from '@/util/Constants';
import { Roles } from '@/util/decorators/Roles';
import { RoleGuard } from '@/util/guards/role.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { AddEthnicGroupMapDto } from '../../map/dto/AddEthnicGroupMapDto';
import { EthnicGroupMapDto } from '../../map/dto/EthnicGroupMapDto';
import { MapService } from '../../map/services/map.service';
import { StoryService } from '../../story/services/story.service';
import { AddStoryDto } from '../../story/dto/story/AddStoryDto';
import { EditStoryDto } from '../../story/dto/story/EditStoryDto';
import { StoryDto } from '../../story/dto/story/StoryDto';
import { AddTextStoryDto } from '../../story/dto/text-story/AddTextStoryDto';
import { TextStoryDto } from '../../story/dto/text-story/TextStoryDto';
import { StoryWithTextDto } from '../../story/dto/story/story-with-text.dto';
import { User } from '@/util/decorators/User';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '../../auth/interface/jwt-payload.interface';
import { AddAudioStoryDto } from '../../story/dto/audio-story/AddAudioStoryDto';

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
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: StoryWithTextDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @Roles(Role.admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Post('story/add')
  async addStory(@Body() dto: AddStoryDto): Promise<StoryWithTextDto> {
    return this.storyService.addStoryWithText(dto);
  }

  @ApiOperation({
    summary: 'редактирование сказки',
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
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @HttpCode(HttpStatus.OK)
  @Put('story/edit/:storyId')
  async editSotry(
    @Param('storyId', ParseIntPipe) storyId: number,
    @Body() dto: EditStoryDto,
  ) {
    return this.storyService.editStory(storyId, dto);
  }

  @ApiOperation({
    summary: 'удаление сказки',
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
  @Roles(Role.admin)
  @HttpCode(HttpStatus.OK)
  @Delete('story/delete/:storyId')
  async deleteStoryById(@Param('storyId', ParseIntPipe) storyId: number) {
    return this.storyService
      .deleteStoryById(storyId)
      .catch((error) => {
        throw new HttpException(error.message, error.status);
      })
      .then((result) => {});
  }

  @ApiOperation({
    summary: 'добавление текста сказки',
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
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @HttpCode(HttpStatus.OK)
  @Post('story/text/add/:storyId')
  async addTextStory(
    @Param('storyId', ParseIntPipe) storyId,
    @Body() dto: AddTextStoryDto,
  ) {
    return this.storyService.addTextStory(storyId, dto);
  }

  @ApiOperation({
    summary: 'добавление озвучки к сказке',
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
  @Roles(Role.admin)
  @Put('/story/:storyId/audio')
  async setUserAudioToStory(
    @Param('storyId', ParseIntPipe) storyId: number,
    @Body() dto: AddAudioStoryDto,
    @User() user: JwtPayload,
  ): Promise<void> {
    return this.storyService.setUserAudioToStory(
      parseInt(user.sub),
      storyId,
      dto,
    );
  }
}
