import { RatingAudioStoryEntity } from '@/app/modules/story/entity/rating-audio-story/RatingAudioStoryEntity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RatingAudioStoryWithUserAudio extends RatingAudioStoryEntity {
  @ApiProperty({ description: '', nullable: false })
  @IsNumber()
  userAudioId: number;

  constructor(
    id: number,
    storyAudioId: number,
    userId: number,
    rating: number,
    userAudioId: number,
  ) {
    super(id, storyAudioId, userId, rating);
    this.userAudioId = userAudioId;
  }
}
