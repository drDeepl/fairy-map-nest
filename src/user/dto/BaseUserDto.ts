import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class BaseUserDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty({
    message: 'имя пользователя не может быть пустым',
  })
  firstName: string;
  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty({
    message: 'фамилия пользователя не может быть пустой',
  })
  lastName: string;

  @ApiProperty({ description: '', nullable: false })
  @IsEmail()
  @IsNotEmpty({
    message: 'электронная почта не можетбыть пустой',
  })
  email: string;

  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty({
    message: 'роль пользователя не может быть пустой',
  })
  role: string;
}
