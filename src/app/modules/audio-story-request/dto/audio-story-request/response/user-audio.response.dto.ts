import { LanguageDto } from '@/app/modules/ethnic-group/dto/LanguageDto';
import { ApiProperty } from '@nestjs/swagger';

export class UserAudioWithLanguageResponseDto {
  @ApiProperty({ description: 'ид озвучки' })
  id: number;

  @ApiProperty({ description: 'название файла' })
  name: string;

  @ApiProperty({ description: 'прямая ссылка на файл' })
  srcAudio: string;

  @ApiProperty({
    description: 'информация о языке',
    type: () => LanguageDto,
  })
  language: LanguageDto;

  constructor(dto: Partial<UserAudioWithLanguageResponseDto>) {
    this.id = dto.id;
    this.name = dto.name;
    this.srcAudio = dto.srcAudio;
    this.language = dto.language;
  }
}
