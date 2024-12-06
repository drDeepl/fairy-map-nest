import { LanguageDto } from '@/app/modules/ethnic-group/dto/LanguageDto';
import { AuthorAudioStoryResponseDto } from '@/app/modules/user/dto/response/author-audio-story.response.dto';
import { UserResponseDto } from '@/app/modules/user/dto/response/user.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AudioStoryResponseDto {
  @ApiProperty({ description: 'id озвучки' })
  id: number;

  @ApiProperty({ description: 'id сказки' })
  storyId: number;

  @ApiProperty({ description: 'язык озвучки', type: LanguageDto })
  language: LanguageDto;

  @ApiProperty({ description: 'id файла с озвучкой' })
  audioId: number;

  @ApiProperty({ description: 'автор озвучки' })
  author: AuthorAudioStoryResponseDto;

  @ApiProperty({ description: 'рейтинг озвучки' })
  moderateScore: number;

  constructor(dto: Partial<AudioStoryResponseDto>) {
    this.id = dto.id;
    this.audioId = dto.audioId;
    this.language = dto.language;
    this.storyId = dto.storyId;
    this.moderateScore = dto.moderateScore;
    this.author = dto.author;
  }
}
