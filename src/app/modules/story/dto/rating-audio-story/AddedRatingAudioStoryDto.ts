import { ApiProperty } from '@nestjs/swagger';

export class AddedRatingAudioStoryDto {
  @ApiProperty({ description: 'ид озвучки' })
  audioId: number;

  @ApiProperty({ description: 'оценка текущего пользователя' })
  ratingCurrentUser: number;

  @ApiProperty({ description: 'общая оценка озвучки' })
  ratingAudioStory: number;

  constructor(dto: Partial<AddedRatingAudioStoryDto>) {
    this.audioId = dto.audioId;
    this.ratingCurrentUser = dto.ratingCurrentUser;
    this.ratingAudioStory = dto.ratingAudioStory;
  }
}
