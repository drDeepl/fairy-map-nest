import { ApiProperty } from '@nestjs/swagger';
import { StoryDto } from '../StoryDto';

export class StoryWithImgResponseDto extends StoryDto {
  @ApiProperty({ description: 'url для получения обложки сказки' })
  srcImg: string;

  constructor(dto: Partial<StoryWithImgResponseDto>) {
    super(dto.id, dto.name, dto.audioId, dto.ethnicGroup);
    this.srcImg = dto.srcImg;
  }
}
