import { ApiProperty } from '@nestjs/swagger';
import { BaseUserAudioDto } from './BaseUserAudioDto';

export class UploadedUserAudioDto extends BaseUserAudioDto {
  @ApiProperty({ description: '', nullable: false })
  id: number;
}
