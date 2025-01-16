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
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
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
import { File } from 'multer';
import { JwtPayload } from '../../auth/interface/jwt-payload.interface';
import { AddAudioStoryDto } from '../../story/dto/audio-story/AddAudioStoryDto';

import { FileInterceptor } from '@nestjs/platform-express';

import { StoryBookResponseDto } from '../../story/dto/story/response/story-with-img.response.dto';
import { CurrentUser } from '@/common/decorators/user.decorator';
import { AudioStoryResponseDto } from '../../story/dto/audio-story/response/audio-story.response.dto';
import { UserAudioService } from '../../user-audio/services/user-audio.service';
import { BaseUserAudioDto } from '../../user-audio/dto/BaseUserAudioDto';
import { MessageResponseDto } from '@/common/dto/response/message.response.dto';
import { UserAccess } from '../../user/decorators/user.decorator';
import { UserResponseDto } from '../../user/dto/response/user.response.dto';
import { UserService } from '../../user/services/user.service';

@ApiTags('AdminController')
@Controller('admin')
export class AdminController {
  private readonly logger = new Logger('StoryController');

  constructor(
    private readonly mapService: MapService,
    private readonly storyService: StoryService,
    private readonly userAudioService: UserAudioService,
    private readonly userService: UserService,
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
  @Post('/story/:storyId/audio')
  async setUserAudioToStory(
    @Param('storyId', ParseIntPipe) storyId: number,
    @Body() dto: AddAudioStoryDto,
  ): Promise<void> {
    return this.storyService.setUserAudioToStory(storyId, dto);
  }

  @ApiOperation({
    summary: 'загрузка озвучки для сказки',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AudioStoryResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.admin)
  @UseInterceptors(FileInterceptor('audio'))
  @Post('/story/:storyId/language/:languageId/audio/upload')
  async uploadAudioStory(
    @UploadedFile() file: File,
    @Param('storyId', ParseIntPipe) storyId: number,
    @Param('languageId', ParseIntPipe) languageId: number,
    @CurrentUser() user: JwtPayload,
  ): Promise<AudioStoryResponseDto> {
    const audioStory = await this.storyService.addAudioStory({
      userId: +user.sub,
      storyId: storyId,
      languageId: languageId,
      filename: file.filename,
      originalName: file.originalname,
      pathAudio: file.path,
    });

    return audioStory;
  }

  @ApiOperation({
    summary: 'загрузка обложки для выбранной сказки',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: StoryBookResponseDto,
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
  @Post('/story/:storyId/image/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStoryImage(
    @UploadedFile() file: File,
    @Param('storyId', ParseIntPipe) storyId: number,
  ): Promise<StoryBookResponseDto> {
    return await this.storyService.createImgForStoryOrUpdateIfExists(
      storyId,
      file,
    );
  }

  @ApiOperation({
    summary: 'удаление обложки для выбранной сказки',
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
  @Delete('/story/:storyId/image')
  async deleteStoryImgByStoryId(
    @Param('storyId', ParseIntPipe) storyId: number,
  ): Promise<void> {
    await this.storyService.deleteStoryImgByStoryId(storyId);
  }

  @ApiOperation({
    summary: 'удаление озвучки пользователя',
    description: 'необходима роль администратора',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: BaseUserAudioDto,
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
  @Delete('/audio//delete/:userAudioId')
  async deleteUserAudioById(
    @Req() req,
    @Param('userAudioId', ParseIntPipe) userAudioId: number,
  ) {
    this.logger.debug('DELETE USER AUDIO BY ID');
    return this.userAudioService
      .deleteUserAudioById(userAudioId)
      .catch((error) => {
        this.logger.error(error);
        throw new HttpException(error.message, error.status);
      })
      .then((result) => {});
  }

  @ApiOperation({
    summary: 'удаление пользователя по его id',
    description: 'необходима роль администратора',
  })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @Roles(Role.admin)
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Delete('/user/delete/:userId')
  deleteUser(
    @Param('userId', ParseIntPipe) userId: number,
    @UserAccess() userAccessTokenData,
  ): Promise<MessageResponseDto> {
    this.logger.verbose('deleteUser');
    if (userId === userAccessTokenData.sub || userAccessTokenData.isAdmin) {
      return this.userService.deleteUser(userId);
    }
    throw new HttpException('недостаточно прав', HttpStatus.FORBIDDEN);
  }
}
