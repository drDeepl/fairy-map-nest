import { EthnicGroupDto } from '@/app/modules/ethnic-group/dto/EthnicGroupDto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { BaseStoryDto } from './BaseStoryDto';

export class StoryDto extends BaseStoryDto {
  @ApiProperty({ description: 'id сказки', nullable: false })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'id аудиозаписи', nullable: true })
  audioId: number | null;

  @ApiProperty({ description: 'id этнической группы', nullable: false })
  ethnicGroup: EthnicGroupDto;

  constructor(
    id: number,
    name: string,
    audioId: number,
    ethnicGroup: EthnicGroupDto,
  ) {
    super(name);
    this.id = id;
    this.audioId = audioId;
    this.ethnicGroup = ethnicGroup;
  }
}
