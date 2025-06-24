import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { FeatureDto } from './FeatureResponseDto';

export class FeatureCollectionDto {
  @ApiProperty({
    description: 'Тип объекта, всегда "FeatureCollection"',
    example: 'FeatureCollection',
    readOnly: true,
  })
  @IsString()
  readonly type: 'FeatureCollection' = 'FeatureCollection';

  @ApiProperty({
    description: 'Массив объектов Feature',
    type: [FeatureDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  features: FeatureDto[];
}
