import { ApiProperty } from '@nestjs/swagger';
import { EthnicGroupMapPointEntity } from './EthnicGroupMapPointEntity';
import { ConstituentDto } from '@/app/modules/constituent/dto/ConstituentDto';
import { ConstituentMinimalDto } from '../dto/ConstituentMinimalDto';

export class EthnicGroupMapPointEntityWithConstituents extends EthnicGroupMapPointEntity {
  @ApiProperty({
    description: 'объект региона',
    nullable: false,
  })
  constituent: ConstituentDto;

  constructor(
    id: number,
    ethnicGroupId: number,
    longitude: number,
    latitude: number,
    constituent: ConstituentDto,
  ) {
    super(id, ethnicGroupId, longitude, latitude);
    this.constituent = constituent;
  }
}
