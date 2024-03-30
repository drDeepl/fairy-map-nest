import { ApiProperty } from '@nestjs/swagger';
import { BaseAudioStoryRequestDto } from './BaseAudioStoryRequestDto';

export class AddAudioStoryRequestDto extends BaseAudioStoryRequestDto {
  @ApiProperty({ description: '', nullable: false })
  typeId: number;
}
