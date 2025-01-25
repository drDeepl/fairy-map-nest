import { ApiProperty } from '@nestjs/swagger';
import { AudioResponseDto } from '../../audio-story/response/audio-response.dto';
import { StoryBookResponseDto } from './story-with-img.response.dto';

export class StoryBookWithAudiosResponseDto extends StoryBookResponseDto {
  @ApiProperty({ description: 'одобренные озвучки для сказки' })
  audios: AudioResponseDto[];

  constructor(dto: Partial<StoryBookWithAudiosResponseDto>) {
    super(dto as StoryBookResponseDto, dto.srcImg);
    this.audios = dto.audios;
  }
}
