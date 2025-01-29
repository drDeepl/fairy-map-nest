import { ApiProperty } from '@nestjs/swagger';
import { AudioResponseDto } from '../../audio-story/response/audio-response.dto';

import { EthnicGroupDto } from '@/app/modules/ethnic-group/dto/EthnicGroupDto';
import { IsInt, IsNotEmpty } from 'class-validator';
import { AudioStoryResponseDto } from '../../audio-story/response/audio-story.response.dto';

export class StoryBookWithAudiosResponseDto {
  @ApiProperty({ description: 'id сказки', nullable: false })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'название истории', nullable: false })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'id этнической группы',
    type: () => EthnicGroupDto,
    nullable: false,
  })
  ethnicGroup: EthnicGroupDto;

  @ApiProperty({
    description: 'url для получения обложки сказки',
    nullable: true,
  })
  srcImg: string | null;

  @ApiProperty({
    description: 'текст сказки',
    nullable: true,
  })
  text: string;

  @ApiProperty({
    description: 'одобренные озвучки для сказки',
    type: () => AudioResponseDto,
    isArray: true,
  })
  audios: AudioStoryResponseDto[];

  constructor(dto: Partial<StoryBookWithAudiosResponseDto>) {
    this.id = dto.id;
    this.name = dto.name;
    this.ethnicGroup = dto.ethnicGroup;
    this.srcImg = dto.srcImg;
    this.text = dto.text;
    this.audios = dto.audios;
  }
}
