import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BaseAuthDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty({
    message: 'имя не может быть пустым',
  })
  firstName: string;

  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty({
    message: 'фамилия не может быть пустой',
  })
  lastName: string;

  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty({
    message: 'электронная почта не может быть пустой',
  })
  email: string;
  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty({
    message: 'пароль не может быть пустым',
  })
  password: string;
}
