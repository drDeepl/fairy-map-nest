import { IsNumber } from 'class-validator';
import { BaseRatingAudioStoryDto } from './BaseRatingAudioStoryDto';
import { ApiProperty } from '@nestjs/swagger';

export class AddRatingAudioStoryDto extends BaseRatingAudioStoryDto {
  @ApiProperty({ description: 'id озвучки' })
  @IsNumber()
  audioId: number;
}
