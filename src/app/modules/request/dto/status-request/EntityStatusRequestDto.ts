import { ApiProperty } from '@nestjs/swagger';
import { BaseStatusRequestDto } from './BaseStatusRequestDto';

export class EntityStatusRequestDto extends BaseStatusRequestDto {
  @ApiProperty({ description: '', nullable: false })
  id: number;
}
