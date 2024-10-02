import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class BaseAuthRequestDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty({
    message: 'электронная почта не может быть пустой',
  })
  @IsEmail({}, { message: 'неверный формат электронной почты' })
  email: string;
  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty({
    message: 'пароль не может быть пустым',
  })
  @Length(5, 255, { message: 'пароль должен быть от 5 до 255 символов' })
  password: string;
}
