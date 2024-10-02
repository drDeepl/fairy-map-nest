import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { BaseUserAudioDto } from './BaseUserAudioDto';

export class AddUserAudioDto extends BaseUserAudioDto {
  @ApiProperty({ description: '', nullable: false })
  @IsInt()
  userId: number;
}
