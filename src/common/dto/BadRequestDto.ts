import { ApiProperty } from '@nestjs/swagger';
import { BaseRequestExceptionDto } from './BaseRequestExceptionDto';

export class BadRequestDto extends BaseRequestExceptionDto {
  @ApiProperty({ description: '', nullable: false })
  message: string[];
  @ApiProperty({ description: '', nullable: false })
  error: string;
}
