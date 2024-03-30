import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class AudioRequestWithUserAudioDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '', nullable: false })
  userAudio: { id: number; name: string };

  @ApiProperty({ description: '', nullable: false })
  @IsNumber()
  typeId: number;

  @ApiProperty({ description: '', nullable: false })
  status: Status;

  @ApiProperty({ description: '', nullable: false })
  @IsString()
  comment: string;
}
