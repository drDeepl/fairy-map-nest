import { ApiProperty } from '@nestjs/swagger';

import { IsNumber, IsString } from 'class-validator';

export class EthnicGroupPointDto {
  @ApiProperty({
    description: 'Уникальный идентификатор точки',
    example: 18,
  })
  @IsNumber()
  idPoint: number;

  @ApiProperty({ description: 'ID этнической группы', example: 1 })
  @IsNumber()
  ethnicGroupId: number;

  @ApiProperty({
    description: 'Название этнической группы',
    example: 'Русские',
  })
  @IsString()
  ethnicGroupName: string;

  @ApiProperty({ description: 'Широта точки', example: 53.289372 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: 'Долгота точки', example: 83.819076 })
  @IsNumber()
  longitude: number;
}
