import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BaseAudioStoryRequestDto {
  @ApiProperty({ description: '', nullable: false })
  @IsString()
  comment: string;

  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty()
  status: string;
}
