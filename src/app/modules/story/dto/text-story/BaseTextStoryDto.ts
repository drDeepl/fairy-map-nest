import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BaseTextStoryDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty()
  text: string;
}
