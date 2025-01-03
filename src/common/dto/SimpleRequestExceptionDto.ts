import { ApiProperty } from '@nestjs/swagger';
import { BaseRequestExceptionDto } from './BaseRequestExceptionDto';

export class SimpleRequestExceptionDto extends BaseRequestExceptionDto {
  @ApiProperty({ description: '', nullable: false })
  message: string;
}
