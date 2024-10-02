import { ApiProperty } from '@nestjs/swagger';
import { BaseAudioStoryDto } from './BaseAudioStoryDto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddAudioStoryDto extends BaseAudioStoryDto {
  @ApiProperty({ description: '', nullable: false })
  userId: number;

  @ApiProperty({
    description: 'оценка от проверяющего',
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  moderateScore: number;
}
