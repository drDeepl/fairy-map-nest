import { ApiProperty } from '@nestjs/swagger';
import { BaseEthnicGroupMapDto } from './BaseEthnicGroupMapDto';
import { IsNumber } from 'class-validator';

export class AddEthnicGroupMapDto extends BaseEthnicGroupMapDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNumber()
  constituentId: number;
}
