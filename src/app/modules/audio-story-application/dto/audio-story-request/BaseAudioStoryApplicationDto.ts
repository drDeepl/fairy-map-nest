import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BaseAudioStoryApplicationDto {
  @ApiProperty({ description: '', nullable: false })
  @IsString()
  comment: string;

  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty()
  status: string;
}
