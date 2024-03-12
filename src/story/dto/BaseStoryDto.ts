import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class BaseStoryDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty()
  text: string;
}
