import { UserAccessInterface } from '@/auth/interface/UserAccessInterface';
import { Role } from '@/util/Constants';
import { Roles } from '@/util/decorators/Roles';
import { User } from '@/util/decorators/User';
import { RoleGuard } from '@/util/guards/role.guard';
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
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddStoryRequestService } from './add-story-request.service';
import { AddStoryRequestDto } from './dto/AddStoryRequestDto';
import { CreateAddStoryRequestDto } from './dto/CreateAddStoryRequestDto';
import { EditAddStoryRequestDto } from './dto/EditAddStoryRequestDto';
import { AddStoryRequestEntity } from './entity/AddStoryRequestEntity';
import { StoryRequestGateway } from '@/ws-story-request/ws-story-request.gateway';

@ApiTags('AddStoryRequestController')
@Controller('api/add-story-request')
export class AddStoryRequestController {
  private readonly logger = new Logger(AddStoryRequestController.name);

  constructor(
    private readonly addStoryReqService: AddStoryRequestService,
    private readonly addStoryRequestGateway: StoryRequestGateway,
  ) {}

  @ApiOperation({
    summary: 'получение всех заявок на добавление сказки',
    description: 'пример запроса: /api/add-story-request/all?start=1&count=10',
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
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
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
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('/my-requests')
  async getAddStoryRequestForCurrentUser(
    @User() user: UserAccessInterface,
  ): Promise<AddStoryRequestDto[]> {
    this.logger.debug('GET ADD STORY REQUEST FOR CURRENT USER');
    return await this.addStoryReqService.getAddStoryRequestsByUserId(user.sub);
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
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('/create')
  async createAddStoryRequestForCurrentUser(
    @User() user: UserAccessInterface,
    @Body() dto: CreateAddStoryRequestDto,
  ): Promise<AddStoryRequestDto> {
    this.logger.debug('CREATE ADD STORY REQEUST FOR CURRENT USER');
    console.log(user);
    return await this.addStoryReqService.createAddStoryRequest(user.sub, dto);
  }

  @ApiOperation({
    summary: 'обновление заявки',
    description: `статус заявки берется из /api/request/status/all | Необходима роль ${Role.moder} | После успешного редактирования данные заявки так же передаются пользователю с userId по веб-сокету`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AddStoryRequestEntity,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put('/edit/:addStoryRequestId')
  async editStatusAddStoryReqeust(
    @Param('addStoryRequestId', ParseIntPipe) addStoryRequestId: number,
    @Body() dto: EditAddStoryRequestDto,
  ): Promise<AddStoryRequestEntity> {
    try {
      const editedRequest: AddStoryRequestEntity =
        await this.addStoryReqService.editStatusById(addStoryRequestId, dto);
      await this.addStoryRequestGateway.handleRequestAddStory(editedRequest);
      return editedRequest;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @ApiOperation({
    summary: 'удаление заявки',
    description: `Необходима роль ${Role.admin}`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
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
