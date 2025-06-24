import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsEnum } from 'class-validator';

enum GeometryType {
  Point = 'Point',
  MultiPoint = 'MultiPoint',
  LineString = 'LineString',
  MultiLineString = 'MultiLineString',
  Polygon = 'Polygon',
  MultiPolygon = 'MultiPolygon',
  GeometryCollection = 'GeometryCollection',
}

export class GeometryDto {
  @ApiProperty({
    description: 'Тип геометрии',
    enum: GeometryType,
    example: GeometryType.Polygon,
  })
  @IsEnum(GeometryType)
  type: string;

  @ApiProperty({
    description:
      'Координаты геометрии. Структура зависит от поля type. Для Polygon это массив массивов числовых пар: number[][].',
    example: [
      [
        [85.116, 54.437],
        [85.159, 54.452],
        /* ... */
      ],
    ],
  })
  @IsArray() // Простая валидация, что это массив
  coordinates: any[];
}
