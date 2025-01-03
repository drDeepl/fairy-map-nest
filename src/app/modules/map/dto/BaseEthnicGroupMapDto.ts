import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class BaseEthnicGroupMapDto {
  @ApiProperty({ description: 'географическая долгота', nullable: false })
  @IsNumber()
  longitude: number;

  @ApiProperty({ description: 'географическая широта', nullable: false })
  @IsNumber()
  latitude: number;

  constructor(longitude: number, latitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
