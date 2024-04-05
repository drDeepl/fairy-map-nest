import { ApiProperty } from '@nestjs/swagger';

export class BaseImageStory {
  @ApiProperty({ description: '', nullable: false })
  storyId: number;
}
