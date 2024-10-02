import { ApiProperty } from '@nestjs/swagger';

export class EthnicGroupMapPointEntity {
  @ApiProperty({ description: '', nullable: false })
  id: number;

  @ApiProperty({ description: '', nullable: false })
  ethnicGroupId: number;
  @ApiProperty({ description: '', nullable: false })
  longitude: number;
  @ApiProperty({ description: '', nullable: false })
  latitude: number;

  constructor(
    id: number,
    ethnicGroupId: number,
    longitude: number,
    latitude: number,
  ) {
    this.id = id;
    this.ethnicGroupId = ethnicGroupId;
    this.longitude = longitude;
    this.latitude = latitude;
  }
}
