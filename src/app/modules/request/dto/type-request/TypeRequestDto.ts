import { ApiProperty } from '@nestjs/swagger';
import { BaseTypeRequestDto } from './BaseTypeRequestDto';

export class TypeRequestDto extends BaseTypeRequestDto {
  @ApiProperty({ description: '', nullable: false })
  id: number;
}
