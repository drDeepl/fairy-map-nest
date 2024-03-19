import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BaseTypeRequestDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty()
  name: string;
}
