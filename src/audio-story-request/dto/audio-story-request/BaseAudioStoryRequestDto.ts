import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class BaseAudioStoryRequestDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty()
  @IsNumber()
  userAudioId: number;

  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
