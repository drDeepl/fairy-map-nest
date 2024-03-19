import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AudioStoryRequestService } from './audio-story-request.service';
import { ConstituentDto } from '@/constituent/dto/ConstituentDto';
import { Role } from '@/util/Constants';
import { Roles } from '@/util/decorators/Roles';
import { RoleGuard } from '@/util/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { TypeRequestDto } from './dto/type-request/TypeRequestDto';
import { AddTypeRequestDto } from './dto/type-request/AddTypeRequestDto';
import { EditTypeRequestDto } from './dto/type-request/EditTypeRequestDto';

@ApiTags('AudioStoryRequestController')
@Controller('api/audio-story-request')
export class AudioStoryRequestController {
  private readonly logger = new Logger('RequestAudioStoryController');
  constructor(private audioStoryRequestService: AudioStoryRequestService) {}

  @ApiOperation({ summary: 'получение списка всех типов заявок' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [TypeRequestDto],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/type-request/all')
  async getAllRequestTypes(): Promise<TypeRequestDto[]> {
    this.logger.debug('GET ALL REQUEST TYPES');
    return this.audioStoryRequestService.getAllRequestTypes();
  }

  @ApiOperation({ summary: 'получение типа заявки по id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [TypeRequestDto],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/type-request/:typeRequestId')
  async getTypeRequestById(
    @Param('typeRequestId', ParseIntPipe) typeRequestId: number,
  ) {
    this.logger.debug('GET TYPE REQUEST BY ID');
    return this.audioStoryRequestService.getTypeRequestById(typeRequestId);
  }

  @ApiOperation({ summary: 'добавление типа заявки' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: TypeRequestDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/type-request/add')
  async addTypeRequest(
    @Body() dto: AddTypeRequestDto,
  ): Promise<TypeRequestDto> {
    this.logger.debug('ADD TYPE REQUEST');
    return this.audioStoryRequestService.addTypeRequest(dto);
  }

  @ApiOperation({ summary: 'редактирование типа заявки' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: TypeRequestDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Put('/type-request/edit/:typeRequestId')
  async editTypeRequest(
    @Param('typeRequestId', ParseIntPipe) typeRequestId: number,
    @Body() dto: EditTypeRequestDto,
  ): Promise<TypeRequestDto> {
    this.logger.debug('ADD TYPE REQUEST');
    return this.audioStoryRequestService.editTypeRequest(typeRequestId, dto);
  }

  @ApiOperation({ summary: 'удаление типа заявки' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('/type-request/delete/:typeRequestId')
  async deleteTypeRequestById(
    @Param('typeRequestId', ParseIntPipe) typeRequestId: number,
  ) {
    this.logger.debug('DELETE TYPE REQUEST BY ID');
    return this.audioStoryRequestService
      .deleteTypeRequestById(typeRequestId)
      .then((result) => {});
  }
}
