import { JwtPayload } from '@/app/modules/auth/interface/jwt-payload.interface';
import { Role } from '@/util/Constants';
import { Roles } from '@/util/decorators/Roles';
import { User } from '@/util/decorators/User';
import { RoleGuard } from '@/util/guards/role.guard';
import { StoryRequestGateway } from '@/shared/ws-story/ws-story.gateway';
import {
  Body,
  Controller,
  Delete,
  Get,
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

import {
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddStoryRequestService } from './add-story-request.service';
import { AddStoryRequestDto } from './dto/AddStoryRequestDto';
import { CreateAddStoryRequestDto } from './dto/CreateAddStoryRequestDto';
import { EditAddStoryRequestDto } from './dto/EditAddStoryRequestDto';
import { AddStoryRequestEntity } from './entity/AddStoryRequestEntity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('AddStoryRequestController')
@Controller('add-story-request')
export class AddStoryRequestController {
  private readonly logger = new Logger(AddStoryRequestController.name);

  constructor(private readonly addStoryReqService: AddStoryRequestService) {}

  @ApiOperation({
    summary: 'получение всех заявок на добавление сказки',
    description:
      'необходима роль администратора. пример запроса: /api/add-story-request/all?start=1&count=10',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [AddStoryRequestEntity],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiQuery({ name: 'start', description: 'номер первого элемента' })
  @ApiQuery({ name: 'count', description: 'количество элементов' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @Roles(Role.admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/all')
  async getAddStoryRequestAll(
    @Query('start') start: number,
    @Query('count') count: number,
  ): Promise<AddStoryRequestEntity[]> {
    this.logger.debug('GET ADD STORY REQUEST FOR CURRENT USER');
    return await this.addStoryReqService.getAddStoryRequests(start, count);
  }

  @ApiOperation({
    summary:
      'получение всех заявок на добавление сказки от текущего пользователя',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [AddStoryRequestDto],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/my-requests')
  async getAddStoryRequestForCurrentUser(
    @User() user: JwtPayload,
  ): Promise<AddStoryRequestDto[]> {
    this.logger.debug('GET ADD STORY REQUEST FOR CURRENT USER');
    return await this.addStoryReqService.getAddStoryRequestsByUserId(
      parseInt(user.sub),
    );
  }

  @ApiOperation({
    summary:
      'получение всех заявок на добавление сказки для выбранного пользователя',
    description: 'необходима роль администратора.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [AddStoryRequestDto],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @Roles(Role.admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/by-user/:userId')
  async getAddStoryRequestByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<AddStoryRequestDto[]> {
    this.logger.debug('GET ADD STORY REQUEST BY USER');
    return await this.addStoryReqService.getAddStoryRequestsByUserId(userId);
  }

  @ApiOperation({
    summary: 'создание заявки на добавление сказки',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AddStoryRequestDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createAddStoryRequestForCurrentUser(
    @User() user: JwtPayload,
    @Body() dto: CreateAddStoryRequestDto,
  ): Promise<AddStoryRequestDto> {
    this.logger.debug('CREATE ADD STORY REQEUST FOR CURRENT USER');
    console.log(user);
    return await this.addStoryReqService.createAddStoryRequest(
      parseInt(user.sub),
      dto,
    );
  }

  @ApiOperation({
    summary: 'обновление заявки',
    description: `необходима роль администратора. статус заявки берется из /api/request/status/all | Необходима роль ${Role.moder} | После успешного редактирования данные заявки так же передаются пользователю с userId по веб-сокету`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AddStoryRequestEntity,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiHeader({
    name: 'authorization',
    description: 'Пример: Bearer accessToken',
  })
  @Roles(Role.admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('/edit/:addStoryRequestId')
  async editStatusAddStoryReqeust(
    @Param('addStoryRequestId', ParseIntPipe) addStoryRequestId: number,
    @Body() dto: EditAddStoryRequestDto,
  ): Promise<AddStoryRequestEntity> {
    try {
      const editedRequest: AddStoryRequestEntity =
        await this.addStoryReqService.editStatusById(addStoryRequestId, dto);

      return editedRequest;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @ApiOperation({
    summary: 'удаление заявки',
    description: `Необходима роль администратора`,
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
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('delete/:addStoryRequestId')
  async deleteAddStoryRequestById(
    @Param('addStoryRequestId', ParseIntPipe) addStoryRequestId: number,
  ) {
    this.logger.debug('DELETE ADD STORY REQUEST BY ID');
    return await this.addStoryReqService.deleteAddStoryRequestById(
      addStoryRequestId,
    );
  }
}
