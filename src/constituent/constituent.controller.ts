import { Role } from '@/util/Constants';
import { Roles } from '@/util/decorators/Roles';
import { RoleGuard } from '@/util/guards/role.guard';
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
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConstituentsService } from './constituent.service';
import { AddConstituentDto } from './dto/AddConstituentDto';
import { AddEthnicGroupToConstituentDto } from './dto/AddEthnicGroupToConstituentDto';
import { ConstituentDto } from './dto/ConstituentDto';
import { ConstituentFilledDto } from './dto/ConstituentFilledDto';
import { DeleteEthnicGroupToConstituentDto } from './dto/DeleteEthnicGroupToConstituentDto';
import { EditConstituentDto } from './dto/EditConstituentDto';
import { EthnicGroupToConstituentDto } from './dto/EthnicGroupToConstituentDto';

@ApiTags('ConstituentController')
@Controller('api/constituent')
export class ConstituentsController {
  private readonly logger = new Logger('ConstituentsController');
  constructor(private readonly constituentService: ConstituentsService) {}

  @ApiOperation({
    summary: 'добавление субъекта РФ',
    description: 'необходима роль администратора',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: ConstituentDto,
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
  @Post('/add')
  async addConstituent(
    @Body() dto: AddConstituentDto,
  ): Promise<ConstituentDto> {
    this.logger.warn('ADD CONSTITUENT');
    return this.constituentService.addNewConstituent(dto);
  }

  @ApiOperation({
    summary: 'добавление этнической группы к субъекту рф',
    description: 'небходима роль администратора',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: EthnicGroupToConstituentDto,
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
  @Post('/add/ethnic-group')
  async addEthnicGroupToConstituent(
    @Body() dto: AddEthnicGroupToConstituentDto,
  ): Promise<EthnicGroupToConstituentDto> {
    this.logger.debug('ADD ETHNIC GROUP TO CONSTITUENT RF');
    return this.constituentService.addEthnicGroupToConstituent(dto);
  }

  @ApiOperation({
    summary: 'удаление этнической группы у субъекта рф',
    description: 'необходима роль администратора',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: EthnicGroupToConstituentDto,
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
  @Delete('/ethnic-group/delete')
  async deleteEthnicGroupFromConstituent(
    @Body() dto: DeleteEthnicGroupToConstituentDto,
  ) {
    this.logger.debug('DELETE ETHNIC GROUP FROM CONSTITUENT');
    return this.constituentService
      .deleteEthnicGroupFromConstituentById(dto)
      .catch((error) => {
        throw new HttpException(error.message, error.status);
      })
      .then((result) => {});
  }

  @ApiOperation({
    summary: 'получение этнической группы, принадлежащей субъекту рф',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [EthnicGroupToConstituentDto],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @HttpCode(HttpStatus.OK)
  @Get('/ethnic-group/:constituentId')
  async getEthnicGroupByConstituentId(
    @Param('constituentId', ParseIntPipe) constituentId: number,
  ): Promise<EthnicGroupToConstituentDto[]> {
    this.logger.debug('GET ETHNIC GROUP FOR CONSTITUENT');
    return this.constituentService.getEthnicGroupByConstituentId(constituentId);
  }

  @ApiOperation({ summary: 'получение всех субъектов' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [ConstituentDto],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @HttpCode(HttpStatus.OK)
  @Get('/all')
  async getConstituents(): Promise<ConstituentDto[]> {
    this.logger.warn('GET CONSTITUENTS');
    return this.constituentService.getConstituents();
  }

  @ApiOperation({
    summary: 'получение списка заполненности субъектов',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [ConstituentFilledDto],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @HttpCode(HttpStatus.OK)
  @Get('/percent-of-filled')
  async getPercentsFilledStoriesByConstituentId(): Promise<
    ConstituentFilledDto[]
  > {
    this.logger.warn('GET CONSTITUENTS');

    return await this.constituentService.getPercentOfFilledConstituent();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'редактирование субъекта',
    description: 'небходима роль администратора',
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
  @Put('/edit/:id')
  async editConstituent(
    @Param('id', ParseIntPipe) id,
    @Body() dto: EditConstituentDto,
  ) {
    this.logger.warn('EDIT CONSTITUENT');
    return this.constituentService.editConstituentById(id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'удаление данных субъекта',
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
  @Delete('/:id')
  async deleteConstituentById(@Param('id', ParseIntPipe) id: number) {
    this.logger.warn('DELETE CONSTITUENT BY ID');
    return this.constituentService
      .deleteConstituentById(id)
      .catch((error) => {
        throw new HttpException(error.message, error.status);
      })
      .then((result) => {});
  }
}
