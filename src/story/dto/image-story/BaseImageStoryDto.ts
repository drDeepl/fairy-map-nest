import { ApiProperty } from '@nestjs/swagger';

export class BaseImageStoryDto {
  @ApiProperty({
    description: 'ид сказки',
    nullable: false,
  })
  storyId: number;
}
