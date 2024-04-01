import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BaseStoryDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty()
  name: string;
}
