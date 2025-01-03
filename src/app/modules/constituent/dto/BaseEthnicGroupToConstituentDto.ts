import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class BaseEthnicGroupToConstituentDto {
  @ApiProperty({ description: '', nullable: false })
  @IsInt()
  constituentRfId: number;
  @ApiProperty({ description: '', nullable: false })
  @IsInt()
  ethnicGroupId: number;
}
