import { ApiProperty } from '@nestjs/swagger';
import { BaseUserAudioDto } from './BaseUserAudioDto';
import { UserAudioStory } from '@prisma/client';

export class UserAudioDto extends BaseUserAudioDto {
  @ApiProperty({ description: 'userAudioId', nullable: false })
  userAudioId: number;

  constructor(dto: Partial<UserAudioStory>) {
    super(dto);
    this.userAudioId = dto.id;
  }
}
