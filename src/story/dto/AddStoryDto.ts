import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { BaseStoryDto } from './BaseStoryDto';

export class AddStoryDto extends BaseStoryDto {
  @ApiProperty({ description: '', nullable: false })
  @IsInt()
  ethnicalGroupId: number;
}
