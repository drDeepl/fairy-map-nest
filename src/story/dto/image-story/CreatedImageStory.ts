import { ApiProperty } from '@nestjs/swagger';
import { BaseImageStoryDto } from './BaseImageStoryDto';

export class CreatedImageStoryDto extends BaseImageStoryDto {
  @ApiProperty({
    description: 'номер изображения(storyImageId)',
    nullable: false,
  })
  id: number;
}
