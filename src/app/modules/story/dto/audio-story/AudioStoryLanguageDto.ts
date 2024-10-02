import { LanguageDto } from '@/app/modules/ethnic-group/dto/LanguageDto';
import { AuthorUserDto } from '@/app/modules/user/dto/AuthorUserDto';
import { ApiProperty } from '@nestjs/swagger';

export class AudioStoryLanguageDto {
  @ApiProperty({ description: 'audioStoryId ', nullable: false })
  id: number;

  @ApiProperty({ description: 'ид озвучки пользователя', nullable: false })
  userAudioId: number;

  @ApiProperty({ description: 'средняя оценка озвучки', nullable: false })
  moderateScore: number;

  @ApiProperty({ description: 'информация о языке', nullable: false })
  language: LanguageDto;

  @ApiProperty({ description: 'информация об авторе', nullable: false })
  authors: AuthorUserDto;
}
