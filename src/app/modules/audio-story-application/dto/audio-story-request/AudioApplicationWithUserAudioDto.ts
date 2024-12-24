import { ApiProperty } from '@nestjs/swagger';
import { Status, TypeRequest } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';
import { UserAudioResponseDto } from './response/user-audio.response.dto';

export class AudioApplicationWithUserAudioDto {
  @ApiProperty({ description: 'ид заявки', nullable: false })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'данные о озвучки пользователя',
    nullable: false,
  })
  userAudio: UserAudioResponseDto;

  @ApiProperty({ description: 'ид пользователя', nullable: false })
  userId: number;

  @ApiProperty({ description: 'статус заявки', nullable: false })
  status: Status;

  @ApiProperty({ description: '', nullable: false })
  @IsString()
  comment: string;

  constructor(dto: Partial<AudioApplicationWithUserAudioDto>) {
    this.id = dto.id;
    this.userAudio = dto.userAudio;
    this.userId = dto.userId;
    this.status = dto.status;
    this.comment = dto.comment;
  }
}
