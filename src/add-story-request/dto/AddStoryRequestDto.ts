import { ApiProperty } from '@nestjs/swagger';
import { BaseAddStoryRequestDto } from './BaseAddStoryRequestDto';

export class AddStoryRequestDto extends BaseAddStoryRequestDto {
  @ApiProperty({ description: 'порядковый номер заявки', nullable: false })
  id: number;
  @ApiProperty({ description: 'комментарий от проверяющего', nullable: false })
  comment: string;
}
