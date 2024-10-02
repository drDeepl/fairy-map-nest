import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BaseLanguageDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty({
    message: 'название не может быть пустым',
  })
  name: string;
}
