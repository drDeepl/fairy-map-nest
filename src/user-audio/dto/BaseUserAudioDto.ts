import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class BaseUserAudioDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '', nullable: false })
  @IsInt()
  userId: number;

  @ApiProperty({ description: '', nullable: false })
  @IsInt()
  languageId: number;
}
