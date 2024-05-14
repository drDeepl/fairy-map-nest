import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { BaseAudioStoryRequestDto } from './BaseAudioStoryRequestDto';

export class AddAudioStoryRequestDto {
  @ApiProperty({ description: '', nullable: false })
  typeId: number;

  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty()
  @IsNumber()
  userAudioId: number;

  @ApiProperty({
    description: 'ид пользователя, создавшего заявку',
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty()
  @IsNumber()
  storyId: number;
}
