import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class BaseAudioStoryDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNumber()
  userAudioId: number;
}
