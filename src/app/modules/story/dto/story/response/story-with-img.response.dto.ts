import { ApiProperty } from '@nestjs/swagger';
import { StoryDto } from '../StoryDto';

export class StoryWithImgResponseDto extends StoryDto {
  @ApiProperty({
    description: 'url для получения обложки сказки',
    nullable: true,
  })
  srcImg: string | null;

  constructor(dto: Partial<StoryDto>, srcImg: string) {
    super(dto.id, dto.name, dto.ethnicGroup);
    this.srcImg = srcImg;
  }
}
