import { ApiProperty } from '@nestjs/swagger';

export class ConstituentMinimalDto {
  @ApiProperty({ description: 'ид региона', nullable: false })
  constituentRfId: number;

  constructor(constituentRfId: number) {
    this.constituentRfId = constituentRfId;
  }
}
