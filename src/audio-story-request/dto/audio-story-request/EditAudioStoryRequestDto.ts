import { ApiProperty } from '@nestjs/swagger';
import { BaseAudioStoryRequestDto } from './BaseAudioStoryRequestDto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EditAudioStoryRequestDto extends BaseAudioStoryRequestDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty()
  @IsNumber()
  statusId: number;

  @ApiProperty({ description: '', nullable: false })
  @IsString()
  comment: string;
}
