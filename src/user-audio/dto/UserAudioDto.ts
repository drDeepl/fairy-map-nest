import { ApiProperty } from '@nestjs/swagger';
import { BaseUserAudioDto } from './BaseUserAudioDto';

export class UserAudioDto extends BaseUserAudioDto {
  @ApiProperty({ description: '', nullable: false })
  id: number;
}
