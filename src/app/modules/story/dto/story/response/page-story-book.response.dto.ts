import { PageResponseDto } from '@/common/dto/response/page.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { StoryBookResponseDto } from './story-with-img.response.dto';

export class PageStoryBookResponseDto extends PageResponseDto<StoryBookResponseDto> {
  @ApiProperty({
    type: [StoryBookResponseDto],
  })
  data: StoryBookResponseDto[];
}
