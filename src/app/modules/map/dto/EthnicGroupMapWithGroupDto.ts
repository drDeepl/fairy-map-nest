import { ApiProperty } from '@nestjs/swagger';
import { BaseEthnicGroupMapDto } from './BaseEthnicGroupMapDto';
import { EthnicGroupDto } from '@/app/modules/ethnic-group/dto/EthnicGroupDto';

export class EthnicGroupMapWithGroupDto extends BaseEthnicGroupMapDto {
  @ApiProperty({ description: '', nullable: false })
  ethnicGroup: EthnicGroupDto;
}
