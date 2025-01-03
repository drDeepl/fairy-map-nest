import { ApiProperty } from '@nestjs/swagger';
import { AudioResponseDto } from './audio-response.dto';

export class PreviewAudioStoryResponseDto {
  @ApiProperty({ description: 'id истории' })
  id: number;

  @ApiProperty({ description: 'название истории' })
  name: string;

  @ApiProperty({ description: 'url обложки' })
  srcImg: string;

  @ApiProperty({
    description: 'массив с озвучками',
    isArray: true,
    type: AudioResponseDto,
  })
  audios: AudioResponseDto[];

  constructor(dto: Partial<PreviewAudioStoryResponseDto>) {
    this.id = dto.id;
    this.srcImg = dto.srcImg;
    this.name = dto.name;
    this.audios = dto.audios;
  }
}
