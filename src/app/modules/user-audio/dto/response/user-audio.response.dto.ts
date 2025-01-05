import { LanguageDto } from '@/app/modules/ethnic-group/dto/LanguageDto';
import { ApiProperty } from '@nestjs/swagger';

export class UserAudioResponseDto {
  @ApiProperty({ description: 'userAudioId', nullable: false })
  userAudioId: number;

  @ApiProperty({ description: 'url для прослушивания файла', nullable: false })
  srcAudio: string;

  @ApiProperty({ description: 'информация о языке озвучки', nullable: false })
  language: LanguageDto;

  @ApiProperty({ description: 'изначальное название озвучки' })
  originalName: string;

  constructor(dto: Partial<UserAudioResponseDto>) {
    this.userAudioId = dto.userAudioId;
    this.originalName = dto.originalName;
    this.srcAudio = dto.srcAudio;
    this.language = dto.language;
  }
}
