import { LanguageDto } from '@/app/modules/ethnic-group/dto/LanguageDto';
import { AuthorAudioStoryResponseDto } from '@/app/modules/user/dto/response/author-audio-story.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AudioResponseDto {
  @ApiProperty({ description: 'id озвучки' })
  id: number;

  @ApiProperty({ description: 'язык озвучки', type: LanguageDto })
  language: LanguageDto;

  @ApiProperty({ description: 'ссылка на файл с озвучкой' })
  srcAudio: string;

  @ApiProperty({
    description: 'автор озвучки',
    type: AuthorAudioStoryResponseDto,
  })
  author: AuthorAudioStoryResponseDto;

  @ApiProperty({ description: 'рейтинг озвучки' })
  commonRating: number;

  constructor(dto: Partial<AudioResponseDto>) {
    this.id = dto.id;
    this.srcAudio = dto.srcAudio;
    this.language = dto.language;
    this.commonRating = dto.commonRating;
    this.author = dto.author;
  }
}
