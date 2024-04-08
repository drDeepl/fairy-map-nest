import { ApiProperty } from '@nestjs/swagger';

export class BaseRatingAudioStoryDto {
  @ApiProperty({
    description: 'номер озвучки из таблицы опубликованных озвучек',
    nullable: false,
  })
  rating: number;
}
