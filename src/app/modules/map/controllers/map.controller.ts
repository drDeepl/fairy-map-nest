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
  Res,
  StreamableFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddEthnicGroupMapDto } from '../dto/AddEthnicGroupMapDto';
import { EthnicGroupMapDto } from '../dto/EthnicGroupMapDto';
import { EthnicGroupMapWithGroupDto } from '../dto/EthnicGroupMapWithGroupDto';
import { EthnicGroupMapPointEntity } from '../entity/EthnicGroupMapPointEntity';
import { EthnicGroupMapPointEntityWithConstituents } from '../entity/EthnicGroupMapPointEntityWithConstituents';
import { MapService } from '../services/map.service';
import { join } from 'path';
import { createReadStream } from 'fs';
import { Response } from 'express';

@ApiTags('MapController')
@Controller('map')
export class MapController {
  private readonly logger = new Logger('MapController');

  constructor(private readonly mapService: MapService) {}

  @ApiOperation({
    summary: 'получить topojson карты',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: StreamableFile,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @Get('map.json')
  getMapTopojson(@Res() res: Response): StreamableFile {
    const filePath = join(
      __dirname,
      '../../../..',
      'static',
      'map',
      'map.topojson.json',
    );

    const readStream = createReadStream(filePath);
    readStream.on('data', (chunk) => console.log(chunk)); // <--- the data log gets printed
    readStream.on('end', () => console.log('done'));
    readStream.on('error', (err) => {
      console.error(err);

      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    });

    return new StreamableFile(readStream);
  }

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
