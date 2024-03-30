import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { AddAudioStoryRequestDto } from './AddAudioStoryRequestDto';

export class EditAudioStoryRequestDto extends AddAudioStoryRequestDto {
  @ApiProperty({ description: '', nullable: false })
  @IsString()
  comment: string;
}
