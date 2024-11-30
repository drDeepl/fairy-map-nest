import { ApiProperty } from '@nestjs/swagger';
import { StoryDto } from '../StoryDto';

export class StoryWithImgResponseDto extends StoryDto {
  @ApiProperty({ description: 'url для получения обложки сказки' })
  srcImg: string | null;

  constructor(dto: Partial<StoryDto>, srcImg: string) {
    super(dto.id, dto.name, dto.audioId, dto.ethnicGroup);
    this.srcImg = srcImg;
  }
}
