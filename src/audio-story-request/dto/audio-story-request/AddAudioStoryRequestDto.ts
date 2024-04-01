import { ApiProperty } from '@nestjs/swagger';
import { BaseAudioStoryRequestDto } from './BaseAudioStoryRequestDto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddAudioStoryRequestDto extends BaseAudioStoryRequestDto {
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
}
