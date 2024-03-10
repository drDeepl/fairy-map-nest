import { ApiProperty } from '@nestjs/swagger';

export class BaseRequestExceptionDto {
  @ApiProperty({ description: '', nullable: false })
  statusCode: number;
}
