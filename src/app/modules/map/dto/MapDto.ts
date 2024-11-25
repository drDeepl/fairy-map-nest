import { ApiProperty } from '@nestjs/swagger';
import { MapTopology } from '../interfaces/map.interface';

export class MapDto {
  @ApiProperty({ description: 'данные карты' })
  data: MapTopology;

  constructor(data: MapTopology) {
    this.data = data;
  }
}
