import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BaseStoryDto {
  @ApiProperty({ description: 'название истории', nullable: false })
  @IsNotEmpty()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
