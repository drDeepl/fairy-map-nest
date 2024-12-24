import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddAudioStoryApplicationDto {
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
