import { ApiProperty } from '@nestjs/swagger';
import { BaseConstituentDto } from './BaseConstituentDto';

export class ConstituentDto extends BaseConstituentDto {
  @ApiProperty({ description: '', nullable: false })
  id: number;
}
