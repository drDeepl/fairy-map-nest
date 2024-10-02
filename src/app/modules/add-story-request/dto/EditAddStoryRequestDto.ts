import { ApiProperty } from '@nestjs/swagger';
import { BaseAddStoryRequestDto } from './BaseAddStoryRequestDto';
import { Status } from '@prisma/client';

export class EditAddStoryRequestDto {
  @ApiProperty({
    description: 'статус заявки берется является ENUM',
    nullable: false,
    enum: Status,
  })
  status: string;

  @ApiProperty({
    description: 'комментарий',
    nullable: false,
  })
  comment: string;
}
