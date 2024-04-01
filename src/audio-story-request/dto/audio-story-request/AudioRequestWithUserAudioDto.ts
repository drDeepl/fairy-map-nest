import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class AudioRequestWithUserAudioDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '', nullable: false })
  userAudio: { id: number; name: string };

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
}
