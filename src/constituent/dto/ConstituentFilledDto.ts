import { ApiProperty } from '@nestjs/swagger';

export class ConstituentFilledDto {
  @ApiProperty({ description: '', nullable: false })
  constituentId: number;
  @ApiProperty({ description: '', nullable: false })
  ethnicGroupCount: number;
  @ApiProperty({ description: '', nullable: false })
  filled: number;

  constructor(constituentId: number, ethnicGroupCount: number, filled: number) {
    this.constituentId = constituentId;
    this.ethnicGroupCount = ethnicGroupCount;
    this.filled = filled;
  }
}
