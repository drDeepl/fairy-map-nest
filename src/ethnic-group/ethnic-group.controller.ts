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
import { EthnicGroupService } from './ethnic-group.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EthnicGroupDto } from './dto/EthnicGroupDto';
import { AddLanguageDto } from './dto/AddLanguageDto';
import { LanguageDto } from './dto/LanguageDto';
import { AddEthnicGroupDto } from './dto/AddEthnicGroupDto';
import { UserAccess, UserIsAdmin } from '@/user/decorators/user.decorator';
import { MessageException } from '@/util/MessageException';
import { RoleGuard } from '@/util/guards/role.guard';
import { Roles } from '@/util/decorators/Roles';
import { Role } from '@/util/Constants';
import { EditEthnicGroupDto } from './dto/EditEthnicGroupDto';
import { EthnicGroupLanguageDto } from './dto/EthnicGroupLanguage';

@ApiTags('EthnicGroupController')
@Controller('api/ethnic-group')
export class EthnicGroupController {
  private readonly logger = new Logger('EthnicGroupController');
  private readonly msgException = new MessageException();

  constructor(private readonly ethnicGroupService: EthnicGroupService) {}

  @ApiOperation({
    summary: 'добавление этнической группы',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: EthnicGroupDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/add')
  async addEthnicGroup(
    @Body() dto: AddEthnicGroupDto,
  ): Promise<EthnicGroupDto> {
    this.logger.warn('ADD ETHNIC GROUP');
    return await this.ethnicGroupService.addEthnicGroup(dto);
  }

  @ApiOperation({
    summary: 'получение списка этнических групп',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [EthnicGroupLanguageDto],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @HttpCode(HttpStatus.OK)
  @Get('/all')
  async ethnicGroups(): Promise<EthnicGroupLanguageDto[]> {
    this.logger.debug('GET ALL ETHNIC GROUPS');
    return await this.ethnicGroupService.getEthnicGroups();
  }

  @ApiOperation({
    summary: 'получение этнической группы по ethnicGroupId',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: EthnicGroupDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @HttpCode(HttpStatus.OK)
  @Get('/:ethnicGroupId')
  async getEthnicGroupById(
    @Param('ethnicGroupId', ParseIntPipe) ethnicGroupId: number,
  ): Promise<EthnicGroupDto> {
    this.logger.debug('GET ETHNIC GROUP BY ID');
    return await this.ethnicGroupService.getEthnicGroupById(ethnicGroupId);
  }

  @ApiOperation({
    summary: 'редактирование этнической группы',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: EthnicGroupDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put('/edit/:id')
  @HttpCode(HttpStatus.OK)
  async editEthnicGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditEthnicGroupDto,
  ): Promise<EthnicGroupDto> {
    this.logger.warn('EDIT ETHNIC GROUP');
    return await this.ethnicGroupService.editEthnicGroup(id, dto);
  }

  @ApiOperation({
    summary: 'удаление этнической группы',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Delete('/:id')
  async deleteEthnicGroup(@Param('id', ParseIntPipe) id: number) {
    this.logger.warn('DELETE ETHNIC GROUP');
    try {
      await this.ethnicGroupService.deleteEthnicGroup(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'добавление языка этнической группы' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: EthnicGroupDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('/language/add')
  async addLanguage(@Body() dto: AddLanguageDto): Promise<LanguageDto> {
    this.logger.debug('ADD LANGUAGE');
    return await this.ethnicGroupService.addLanguage(dto);
  }

  @Get('/language/all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'получение списка всех языков' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [LanguageDto],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async getAllLanguage(): Promise<LanguageDto[]> {
    this.logger.debug('GET LANGUAGES');
    return await this.ethnicGroupService.getLanguages();
  }

  @ApiOperation({ summary: 'удаление языка по id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('/language/:id')
  async deleteLanguageById(@Param('id', ParseIntPipe) id: number) {
    this.logger.debug('GET LANGUAGES');
    return await this.ethnicGroupService
      .deleteLanguageById(id)
      .catch((error) => {
        throw new HttpException(error.message, error.status);
      })
      .then((result) => {});
  }
}
