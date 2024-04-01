import { ApiProperty } from '@nestjs/swagger';

export class AudioStoryEntity {
  @ApiProperty({ description: '', nullable: false })
  id: number;
  @ApiProperty({ description: 'данные автора озвучки', nullable: false })
  author: number;
  @ApiProperty({ description: 'оценка от проверяющего', nullable: false })
  moderateScore: number;
  @ApiProperty({ description: 'ид аудиозаписи пользователя', nullable: false })
  userAudioId: number;
}
