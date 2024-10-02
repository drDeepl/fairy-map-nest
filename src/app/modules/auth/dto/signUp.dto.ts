import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseAuthDto } from './BaseAuthDto';

export class SignUpDto extends BaseAuthDto {
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
}
