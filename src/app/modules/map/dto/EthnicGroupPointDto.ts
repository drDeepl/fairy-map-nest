import { ApiProperty } from '@nestjs/swagger';

export class EthnicGroupPointDto {
  @ApiProperty({ description: 'Уникальный идентификатор точки' })
  idPoint: number;

  @ApiProperty({ description: 'Идентификатор этнической группы' })
  ethnicGroupId: number;

  @ApiProperty({ description: 'Название этнической группы' })
  ethnicGroupName: string;

  @ApiProperty({ description: 'Широта точки' })
  latitude: number;

  @ApiProperty({ description: 'Долгота точки' })
  longitude: number;
}
