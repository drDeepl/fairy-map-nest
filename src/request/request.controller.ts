import { AddTypeRequestDto } from '@/request/dto/type-request/AddTypeRequestDto';
import { EditTypeRequestDto } from '@/request/dto/type-request/EditTypeRequestDto';
import { TypeRequestDto } from '@/request/dto/type-request/TypeRequestDto';
import { Role } from '@/util/Constants';
import { Roles } from '@/util/decorators/Roles';
import { RoleGuard } from '@/util/guards/role.guard';
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
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestService } from './request.service';

@ApiTags('RequestController')
@Controller('/api/request')
export class RequestController {
  private readonly logger = new Logger('RequestController');
  private readonly codeMessages: { P2025: 'выбранной записи не существует' };

  constructor(private readonly requestService: RequestService) {}

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
  @Get('/type/all')
  async getAllRequestTypes(): Promise<TypeRequestDto[]> {
    this.logger.debug('GET ALL REQUEST TYPES');
    return this.requestService.getAllRequestTypes();
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
  @Get('/type/:typeRequestId')
  async getTypeRequestById(
    @Param('typeRequestId', ParseIntPipe) typeRequestId: number,
  ) {
    this.logger.debug('GET TYPE REQUEST BY ID');
    return this.requestService.getTypeRequestById(typeRequestId);
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
  @Post('/type/add')
  async addTypeRequest(
    @Body() dto: AddTypeRequestDto,
  ): Promise<TypeRequestDto> {
    this.logger.debug('ADD TYPE REQUEST');
    return this.requestService.addTypeRequest(dto);
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
  @Put('/type/edit/:typeRequestId')
  async editTypeRequest(
    @Param('typeRequestId', ParseIntPipe) typeRequestId: number,
    @Body() dto: EditTypeRequestDto,
  ): Promise<TypeRequestDto> {
    this.logger.debug('ADD TYPE REQUEST');
    return this.requestService.editTypeRequest(typeRequestId, dto);
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
  @Delete('/type/delete/:typeRequestId')
  async deleteTypeRequestById(
    @Param('typeRequestId', ParseIntPipe) typeRequestId: number,
  ) {
    this.logger.debug('DELETE TYPE REQUEST BY ID');
    return this.requestService
      .deleteTypeRequestById(typeRequestId)
      .then((result) => {});
  }

  @ApiOperation({ summary: 'получение существующих статусов для заявок' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [String],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get('/status/all')
  async getRequestStatuses() {
    this.logger.debug('GET REQUEST STATUTES');
    return await this.requestService.getStatusRequestAll();
  }
}
