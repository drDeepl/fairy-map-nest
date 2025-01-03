import { ApiProperty } from '@nestjs/swagger';
import { TypeRequest } from '@prisma/client';

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
  typeRequest: TypeRequest;

  @ApiProperty()
  storyId: number;

  @ApiProperty()
  comment: string;
}
