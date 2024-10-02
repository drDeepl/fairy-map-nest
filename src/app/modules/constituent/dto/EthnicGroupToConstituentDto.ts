import { ApiProperty } from '@nestjs/swagger';
import { BaseEthnicGroupToConstituentDto } from './BaseEthnicGroupToConstituentDto';
import { IsInt } from 'class-validator';

export class EthnicGroupToConstituentDto extends BaseEthnicGroupToConstituentDto {
  @ApiProperty({ description: '', nullable: false })
  @IsInt()
  id: number;
}
