import { ApiProperty } from '@nestjs/swagger';

export class AudioStoryLanguageDto {
  @ApiProperty({ description: 'audioStoryId ', nullable: false })
  id: number;

  @ApiProperty({ description: 'languageId ', nullable: false })
  languageId: number;
}
