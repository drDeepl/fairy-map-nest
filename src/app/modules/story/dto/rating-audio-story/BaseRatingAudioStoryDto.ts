import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
export class BaseRatingAudioStoryDto {
  @ApiProperty({
    description: 'оценка',
    nullable: false,
  })
  @IsNumber()
  rating: number;
}
