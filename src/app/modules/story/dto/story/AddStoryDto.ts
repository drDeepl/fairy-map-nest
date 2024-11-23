import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { BaseStoryDto } from './BaseStoryDto';

export class AddStoryDto extends BaseStoryDto {
  @ApiProperty({ description: 'id этнической группы', nullable: false })
  @IsInt()
  ethnicGroupId: number;

  @ApiProperty({ description: 'текст сказки', nullable: false })
  @IsString()
  text: string;
}
