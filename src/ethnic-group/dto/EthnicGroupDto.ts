import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { BaseEthnicGroupDto } from './BaseEthnicGroupDto';

export class EthnicGroupDto extends BaseEthnicGroupDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNumber()
  id: number;
  @ApiProperty({ description: '', nullable: false })
  @IsInt()
  languageId: number;
}
