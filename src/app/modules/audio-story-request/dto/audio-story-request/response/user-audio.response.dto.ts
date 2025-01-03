import { ApiProperty } from '@nestjs/swagger';

export class UserAudioResponseDto {
  @ApiProperty({ description: '', nullable: false })
  id: number;

  @ApiProperty({ description: 'название файла', nullable: false })
  name: string;

  @ApiProperty({ description: 'прямая ссылка на файл', nullable: false })
  srcAudio: string;

  constructor(dto: Partial<UserAudioResponseDto>) {
    this.id = dto.id;
    this.name = dto.name;
    this.srcAudio = dto.srcAudio;
  }
}
