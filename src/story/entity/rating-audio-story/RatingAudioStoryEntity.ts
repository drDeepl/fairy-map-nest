import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RatingAudioStoryEntity {
  @ApiProperty({ description: '', nullable: false })
  @IsNumber()
  id: number;
  @ApiProperty({
    description: 'идентификатор одобренной озвучки совпадает с audioId',
    nullable: false,
  })
  storyAudioId: number;
  @ApiProperty({ description: 'идентификатор пользователя', nullable: false })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'оценка пользователя', nullable: false })
  @IsNumber()
  rating: number;

  constructor(
    id: number,
    storyAudioId: number,
    userId: number,
    rating: number,
  ) {
    this.id = id;
    this.storyAudioId = storyAudioId;
    this.userId = userId;
    this.rating = rating;
  }
}
