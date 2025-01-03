import { ApiProperty } from '@nestjs/swagger';

export class ImgStoryResponseDto {
  @ApiProperty({ description: 'id сказки' })
  storyId: number;

  @ApiProperty({ description: 'url для получения картинки' })
  srcUrl: string;

  constructor(dto: Partial<ImgStoryResponseDto>) {
    this.storyId = dto.storyId;
    this.srcUrl = dto.srcUrl;
  }
}
