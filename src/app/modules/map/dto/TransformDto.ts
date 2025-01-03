import { ApiProperty } from '@nestjs/swagger';

export class TransformDto {
  @ApiProperty({
    isArray: true,
    example: [0.322, 0.943],
    type: Array<Array<number>>,
  })
  scale: Array<Array<number>>;

  @ApiProperty({ isArray: true, example: [0.322, 0.943] })
  translate: Array<Array<number>>;
}
