import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { EthnicGroupPointDto } from './EthnicGroupPointDto';

export class PropertiesDto {
  @ApiProperty({ description: 'ID', example: '1' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Название региона', example: 'Алтайский край' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'ISO код', example: 'RU-ALT' })
  @IsString()
  shapeISO: string;

  @ApiProperty({
    description: 'ID формы',
    example: '28173009B19169349567218',
  })
  @IsString()
  shapeID: string;

  @ApiProperty({ description: 'Группа формы', example: 'RUS' })
  @IsString()
  shapeGroup: string;

  @ApiProperty({ description: 'Тип формы', example: 'ADM1' })
  @IsString()
  shapeType: string;

  @ApiProperty({
    description: 'Массив точек с данными об этнических группах',
    type: [EthnicGroupPointDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EthnicGroupPointDto)
  ethnicGroupsPoints: EthnicGroupPointDto[];
}
