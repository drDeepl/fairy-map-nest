import { ApiProperty } from '@nestjs/swagger';
import { StoryDto } from '../StoryDto';

export class StoryBookResponseDto extends StoryDto {
  @ApiProperty({
    description: 'url для получения обложки сказки',
    nullable: true,
  })
  srcImg: string | null;

  @ApiProperty({
    description: 'текст сказки',
    nullable: true,
  })
  text: string;

  constructor(dto: Partial<StoryBookResponseDto>, srcImg: string) {
    super(dto.id, dto.name, dto.ethnicGroup);
    this.text = dto.text;
    this.srcImg = srcImg;
  }
}
