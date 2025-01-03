import { ApiProperty } from '@nestjs/swagger';

export class BaseAudioStoryDto {
  @ApiProperty({ description: '', nullable: false })
  userAudioId: number;
}
