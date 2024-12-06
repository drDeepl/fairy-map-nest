import { ApiProperty } from '@nestjs/swagger';
import { StoryDto } from './StoryDto';

export class StoryWithTextDto extends StoryDto {
  @ApiProperty({ description: 'текст сказки', nullable: false })
  text: string;

  constructor(storyDto: Partial<StoryDto>, text: string) {
    super(storyDto.id, storyDto.name, storyDto.ethnicGroup);
    this.text = text;
  }
}
