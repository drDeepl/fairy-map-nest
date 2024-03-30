import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AddAudioStoryRequestDto } from './AddAudioStoryRequestDto';

export class EditAudioStoryRequestDto extends AddAudioStoryRequestDto {
  @ApiProperty({ description: '', nullable: false })
  @IsString()
  comment: string;

  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty()
  status: string;
}
