import { ApiProperty } from '@nestjs/swagger';

export class AudioStoryRequestEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  userAudioId: number;

  @ApiProperty()
  statusId: number;

  @ApiProperty()
  typeId: number;

  @ApiProperty()
  comment: string;
}
