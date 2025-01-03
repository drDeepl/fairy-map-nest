import { ApiProperty } from '@nestjs/swagger';
import { EthnicGroupPointDto } from './EthnicGroupPointDto';

export class FeatureGeometryPropertiesDto {
  @ApiProperty({ description: 'id' })
  id: string;

  @ApiProperty({ description: 'feature topojson' })
  name: string;

  @ApiProperty({ description: 'Shape group' })
  shapeGroup: string;

  @ApiProperty({ description: 'Shape ID' })
  shapeID: string;

  @ApiProperty({ description: 'Shape ISO' })
  shapeISO: string;

  @ApiProperty({ description: 'Shape type' })
  shapeType: string;

  @ApiProperty({
    description: 'Точки с этническими группами',
    type: EthnicGroupPointDto,
    isArray: true,
  })
  ethnicGroupsPoints: EthnicGroupPointDto[];
}

export class GeometryPropertiesDto {
  @ApiProperty({
    description: 'массив с дугам',
    type: Array<Array<number>>,
    isArray: true,
    example: [[398223, 46698]],
  })
  arcs: number[];

  @ApiProperty()
  type: string;

  @ApiProperty({ type: FeatureGeometryPropertiesDto })
  properties: FeatureGeometryPropertiesDto;
}

export class FeatureGeometryDto {
  @ApiProperty({ description: 'Тип геометрии' })
  type: string;

  @ApiProperty({ type: GeometryPropertiesDto, isArray: true })
  geometries: GeometryPropertiesDto[];
}
