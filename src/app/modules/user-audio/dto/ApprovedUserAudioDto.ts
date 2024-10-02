import { StoryDto } from '@/app/modules/story/dto/story/StoryDto';
import { ApiProperty } from '@nestjs/swagger';
import { UserAudioDto } from './UserAudioDto';

export class ApprovedUserAudioDto {
  @ApiProperty({
    description: 'storyAudioId(ид опубликованной озвучки)',
    nullable: false,
  })
  id: number;

  @ApiProperty({
    description: 'данные озвучки пользователя',
    nullable: false,
  })
  userAudio: UserAudioDto;

  @ApiProperty({
    description: 'id пользователя(автора)',
    nullable: false,
  })
  author: number;

  @ApiProperty({
    description: 'storyAudioId(ид опубликованной озвучки)',
    nullable: false,
  })
  story: StoryDto;
}
