import { ApiProperty } from '@nestjs/swagger';
import { GeometryCollectionDto } from './GeometryCollectionDto';
import { TransformDto } from './TransformDto';

export class MapTopologyDto {
  @ApiProperty({ description: 'тип' })
  type: 'Topology';

  @ApiProperty({
    description: 'массив с дугам',
    type: Array<Array<number>>,
    isArray: true,
    example: [[398223, 46698]],
  })
  arcs: number[];

  @ApiProperty({ description: 'объект преобразования' })
  transform: TransformDto;

  @ApiProperty({
    description: 'Коллекция с геометрией карты',
    type: GeometryCollectionDto,
  })
  objects: {
    map: GeometryCollectionDto;
  };
}
