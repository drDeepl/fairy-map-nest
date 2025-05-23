import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class BaseUserAudioDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '', nullable: false })
  @IsInt()
  languageId: number;

  constructor(dto: Partial<BaseUserAudioDto>) {
    this.name = dto.name;
    this.languageId = dto.languageId;
  }
}
