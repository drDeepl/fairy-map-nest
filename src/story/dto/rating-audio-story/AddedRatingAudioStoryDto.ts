import { ApiProperty } from '@nestjs/swagger';
import { BaseRatingAudioStoryDto } from './BaseRatingAudioStoryDto';

export class AddedRatingAudioStoryDto {
  @ApiProperty({ description: 'оценка текущего пользователя' })
  ratingCurrentUser: number;

  @ApiProperty({ description: 'общая оценка озвучки' })
  ratingAudioStory: number;

  constructor(ratingCurrentUser: number, ratingAudioStory: number) {
    this.ratingCurrentUser = ratingCurrentUser;
    this.ratingAudioStory = ratingAudioStory;
  }
}
