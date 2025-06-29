import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from '../page-meta.dto';

export class PageResponseDto<T> {
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
