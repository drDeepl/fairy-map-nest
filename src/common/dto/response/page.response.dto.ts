import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from '../page-meta.dto';

export class PageResponseDto<T> {
  @ApiProperty({
    isArray: true,
  })
  data: T[];

  @ApiProperty({
    description: 'информация о странице',
    type: PageMetaDto,
  })
  meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
