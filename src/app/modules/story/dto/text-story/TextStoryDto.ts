import { ApiProperty } from '@nestjs/swagger';
import { BaseTextStoryDto } from './BaseTextStoryDto';

export class TextStoryDto extends BaseTextStoryDto {
  @ApiProperty({ description: '', nullable: false })
  id: number;
}
