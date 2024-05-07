import { ApiProperty } from '@nestjs/swagger';
import { BaseEthnicGroupMapDto } from './BaseEthnicGroupMapDto';
import { IsInt, IsNumber } from 'class-validator';

export class EthnicGroupMapDto extends BaseEthnicGroupMapDto {
  @ApiProperty({ description: '', nullable: false })
  @IsInt()
  id: number;

  @ApiProperty({ description: '', nullable: false })
  @IsNumber()
  constituentId: number;
}
