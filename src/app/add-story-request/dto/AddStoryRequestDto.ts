import { ApiProperty } from '@nestjs/swagger';
import { BaseAddStoryRequestDto } from './BaseAddStoryRequestDto';
import { Status } from '@prisma/client';

export class AddStoryRequestDto extends BaseAddStoryRequestDto {
  @ApiProperty({ description: 'порядковый номер заявки', nullable: false })
  id: number;
  @ApiProperty({ description: 'статус заявки', nullable: false, enum: Status })
  status: string;
  @ApiProperty({ description: 'комментарий от проверяющего', nullable: false })
  comment: string;

  constructor(id: number, storyName: string, status: string, comment: string) {
    super(storyName);
    this.id = id;
    this.status = status;
    this.comment = comment;
  }
}
