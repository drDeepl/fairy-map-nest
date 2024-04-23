import { ApiProperty } from '@nestjs/swagger';
import { EthnicGroupMapPointEntity } from './EthnicGroupMapPointEntity';
import { ConstituentDto } from '@/constituent/dto/ConstituentDto';
import { ConstituentMinimalDto } from '../dto/ConstituentMinimalDto';

export class EthnicGroupMapPointEntityWithConstituents extends EthnicGroupMapPointEntity {
  @ApiProperty({
    description: 'массив регионов в котором есть этническая группа',
    nullable: false,
  })
  constituents: Array<number>;

  constructor(
    id: number,
    ethnicGroupId: number,
    longitude: number,
    latitude: number,
    constituents: Array<number>,
  ) {
    super(id, ethnicGroupId, longitude, latitude);
    this.constituents = constituents;
  }
}
