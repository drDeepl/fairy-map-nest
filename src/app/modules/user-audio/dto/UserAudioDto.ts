import { ApiProperty } from '@nestjs/swagger';
import { BaseUserAudioDto } from './BaseUserAudioDto';

export class UserAudioDto extends BaseUserAudioDto {
  @ApiProperty({ description: 'userAudioId', nullable: false })
  id: number;
}
