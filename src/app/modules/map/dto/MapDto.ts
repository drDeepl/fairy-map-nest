import { ApiProperty } from '@nestjs/swagger';
import { MapTopologyDto } from './MapTopologyDto';

export class MapDto {
  @ApiProperty({ description: 'данные карты' })
  data: MapTopologyDto;

  constructor(data: MapTopologyDto) {
    this.data = data;
  }
}
