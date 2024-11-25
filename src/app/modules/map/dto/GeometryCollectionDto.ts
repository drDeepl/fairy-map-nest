import { ApiProperty } from '@nestjs/swagger';
import { FeatureGeometryDto } from './FeaturePropertiesDto';

export class GeometryCollectionDto {
  @ApiProperty({
    description: 'Массив свойств объекта',
    isArray: true,
    type: FeatureGeometryDto,
  })
  map: FeatureGeometryDto;
}
