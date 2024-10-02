import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RatingAudioStoryDto {
  @ApiProperty({ description: 'номер озвучки', nullable: false })
  @IsNumber()
  audioId: number;

  @ApiProperty({ description: 'среднее значение озвучки', nullable: false })
  @IsNumber()
  ratingAudio: number;

  constructor(audioId: number, ratingAudio: number) {
    this.audioId = audioId;
    this.ratingAudio = ratingAudio;
  }
}
