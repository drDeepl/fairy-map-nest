import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BaseConstituentDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty({
    message: 'пароль не может быть пустым',
  })
  name: string;
}
