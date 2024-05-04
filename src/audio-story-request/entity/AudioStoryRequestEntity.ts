import { ApiProperty } from '@nestjs/swagger';

export class AudioStoryRequestEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  userAudioId: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  typeId: number;

  @ApiProperty()
  storyId: number;

  @ApiProperty()
  comment: string;
}
