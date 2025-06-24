import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { GeometryDto } from './GeometryResponseDto';
import { PropertiesDto } from './PropertiesResponseDto';

export class FeatureDto {
  @ApiProperty({
    description: 'Тип объекта, всегда "Feature"',
    example: 'Feature',
    readOnly: true,
  })
  @IsString()
  readonly type: 'Feature' = 'Feature';

  @ApiProperty({ description: 'Свойства, связанные с геометрией' })
  @ValidateNested()
  @Type(() => PropertiesDto)
  properties: PropertiesDto;

  @ApiProperty({ description: 'Геометрия объекта' })
  @ValidateNested()
  @Type(() => GeometryDto)
  geometry: GeometryDto;
}
