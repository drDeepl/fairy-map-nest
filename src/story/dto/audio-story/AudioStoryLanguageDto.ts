import { AuthorUserDto } from '@/user/dto/AuthorUserDto';
import { ApiProperty } from '@nestjs/swagger';

export class AudioStoryLanguageDto {
  @ApiProperty({ description: 'audioStoryId ', nullable: false })
  id: number;

  @ApiProperty({ description: 'ид озвучки пользователя', nullable: false })
  userAudioId: number;

  @ApiProperty({ description: 'languageId ', nullable: false })
  languageId: number;

  @ApiProperty({ description: 'информация об авторе', nullable: false })
  authors: AuthorUserDto;
}
