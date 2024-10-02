import { ApiProperty } from '@nestjs/swagger';

export class BaseStatusRequestDto {
  @ApiProperty({ description: '', nullable: false })
  name: string;
}
