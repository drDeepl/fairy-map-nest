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
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EthnicGroupMapDto } from '../dto/EthnicGroupMapDto';
import { EthnicGroupMapWithGroupDto } from '../dto/EthnicGroupMapWithGroupDto';
import { EthnicGroupMapPointEntity } from '../entity/EthnicGroupMapPointEntity';
import { EthnicGroupMapPointEntityWithConstituents } from '../entity/EthnicGroupMapPointEntityWithConstituents';
import { MapService } from '../services/map.service';
import { ConstituentFilledDto } from '../../constituent/dto/ConstituentFilledDto';
import { ConstituentsService } from '../../constituent/services/constituent.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { promises as fsPromises } from 'fs';
import { join } from 'path';
import { promises as fsPromises } from 'fs';
import { MapDto } from '../dto/MapDto';
import { MapTopology } from '../interfaces/map.interface';

@ApiTags('MapController')
@Controller('map')
export class MapController {
  private readonly logger = new Logger('MapController');

  constructor(
    private readonly mapService: MapService,
    private readonly constituentService: ConstituentsService,
  ) {}

  @ApiOperation({
    summary: 'получить данные для отрисовки карты',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: StreamableFile,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @Get('map.json')
  async getMapTopojson(
    @Res({ passthrough: true }) res: Response,
  ): Promise<MapDto> {
    const filePath = join(
      __dirname,
      '../../../..',
      'static',
      'map',
      'map_with_ethnic_groups_points.json',
    );
    try {
      const data: MapTopology = JSON.parse(
        await fsPromises.readFile(filePath, 'utf-8'),
      );

      return new MapDto(data);
    } catch (error) {
      throw new HttpException(
        'ошибка при чтении данных карты',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  @ApiOperation({ summary: 'получение точек этнических групп на карте' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [EthnicGroupMapWithGroupDto],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @Get('/ethnic-groups')
  async getEthnicalGroupPoints(): Promise<EthnicGroupMapWithGroupDto[]> {
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
  @Get('/ethnic-groups/:constituentId')
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
  @Get('/ethnic-groups/:name')
  async getEthnicGroupPointsByName(
    @Param('name') nameEthnicGroup: string,
  ): Promise<EthnicGroupMapPointEntityWithConstituents[]> {
    return this.mapService.getPointsByNameEthnicGroup(nameEthnicGroup);
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
    summary: 'получение списка субъектов и их заполненности озвучками',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [ConstituentFilledDto],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @HttpCode(HttpStatus.OK)
  @Get('/constituents/filled')
  async getPercentsFilledStoriesByConstituentId(): Promise<
    ConstituentFilledDto[]
  > {
    return await this.constituentService.getPercentOfFilledConstituent();
  }
}
