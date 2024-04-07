import { ApiProperty } from '@nestjs/swagger';
import { BaseAddStoryRequestDto } from './BaseAddStoryRequestDto';

export class EditAddStoryRequestDto extends BaseAddStoryRequestDto {
  @ApiProperty({
    description: 'статус заявки берется является ENUM',
    nullable: false,
  })
  status: string;

  @ApiProperty({
    description: 'комментарий',
    nullable: false,
  })
  comment: string;
}
