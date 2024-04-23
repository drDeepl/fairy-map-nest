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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddEthnicGroupMapDto } from './dto/AddEthnicGroupMapDto';
import { EthnicGroupMapDto } from './dto/EthnicGroupMapDto';
import { EthnicGroupMapWithGroupDto } from './dto/EthnicGroupMapWithGroupDto';
import { EthnicGroupMapPointEntity } from './entity/EthnicGroupMapPointEntity';
import { MapService } from './map.service';
import { EthnicGroupMapPointEntityWithConstituents } from './entity/EthnicGroupMapPointEntityWithConstituents';

@ApiTags('MapController')
@Controller('api/map')
export class MapController {
  private readonly logger = new Logger('MapController');

  constructor(private readonly mapService: MapService) {}

  @ApiOperation({ summary: 'добавление точки этнической группы на карту' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: EthnicGroupMapDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/ethnic-group/add/:ethnicGroupId')
  async addEthnicalGroupPoint(
    @Param('ethnicGroupId', ParseIntPipe) ethnicGroupId: number,
    @Body() dto: AddEthnicGroupMapDto,
  ): Promise<EthnicGroupMapDto> {
    this.logger.debug('ADD ETHNICAL GROUP POINT');
    return this.mapService.addEthnicalGroupPoint(ethnicGroupId, dto);
  }

  @ApiOperation({ summary: 'получение точек этнических групп на карте' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [EthnicGroupMapWithGroupDto],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @Get('/ethnic-group/all')
  async getEthnicalGroupPoints(): Promise<EthnicGroupMapWithGroupDto[]> {
    this.logger.debug('GET ETHNIC GROUP POINTS');
    return this.mapService.getEthnicalGroupPoints();
  }

  @ApiOperation({
    summary: 'получение точек этнических групп по номеру региона',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [EthnicGroupMapPointEntity],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @Get('/ethnic-group/:constituentId')
  async getEthnicalGroupPointsByConstituentId(
    @Param('constituentId', ParseIntPipe) constituentId: number,
  ): Promise<any> {
    this.logger.debug('GET ETHNIC GROUP POINTS');
    return this.mapService.getEthnicalGroupPointsByConstituentId(constituentId);
  }

  @ApiOperation({
    summary: 'получение точек этнических групп по названию этнической группы',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: EthnicGroupMapPointEntityWithConstituents,
    isArray: true,
  })
  @Get('/ethnic-group/by-name-ethnic-group/:name')
  async getEthnicGroupPointsByName(
    @Param('name') nameEthnicGroup: string,
  ): Promise<EthnicGroupMapPointEntityWithConstituents[]> {
    this.logger.debug('GET ETHNIC GROUP POINTS BY GROUP NAME');
    return this.mapService.getPointsByNameEthnicGroup(nameEthnicGroup);
  }

  @ApiOperation({ summary: 'удаление точки этнической группы' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: EthnicGroupMapDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @Roles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('/ethnic-group/delete/:pointId')
  async deleteEthnicalGroupPoint(
    @Param('pointId', ParseIntPipe) pointId: number,
  ) {
    this.logger.debug('DELETE ETHNICAL GROUP POINT');
    return this.mapService
      .deleteEthnicalGroupPoint(pointId)
      .catch((error) => {
        throw new HttpException(error.message, error.status);
      })
      .then((result) => {});
  }
}
