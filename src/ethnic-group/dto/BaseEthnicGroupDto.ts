import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class BaseEthnicGroupDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty({
    message: 'название этнической группы не может быть пустым',
  })
  name: string;

  @ApiProperty({ description: '', nullable: false })
  @IsNumber()
  languageId: number;
}
