import { ApiProperty } from '@nestjs/swagger';
import { BaseEthnicGroupMapDto } from './BaseEthnicGroupMapDto';
import { IsInt } from 'class-validator';

export class EthnicGroupMapDto extends BaseEthnicGroupMapDto {
  @ApiProperty({ description: '', nullable: false })
  @IsInt()
  id: number;
}
