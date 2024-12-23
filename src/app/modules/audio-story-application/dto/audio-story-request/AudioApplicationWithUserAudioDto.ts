import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsInt, IsNumber, IsString } from 'class-validator';
import { UserAudioResponseDto } from './response/user-audio.response.dto';

export class AudioApplicationWithUserAudioDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '', nullable: false })
  userAudio: UserAudioResponseDto;

  @ApiProperty({ description: '', nullable: false })
  userId: number;

  @ApiProperty({ description: 'ид типа заявки', nullable: false })
  @IsNumber()
  typeId: number;

  @ApiProperty({ description: 'статус заявки', nullable: false })
  status: Status;

  @ApiProperty({ description: '', nullable: false })
  @IsString()
  comment: string;

  constructor(dto: Partial<AudioApplicationWithUserAudioDto>) {
    this.id = dto.id;
    this.userAudio = dto.userAudio;
    this.userId = dto.userId;
    this.typeId = dto.typeId;
    this.status = dto.status;
    this.comment = dto.comment;
  }
}
