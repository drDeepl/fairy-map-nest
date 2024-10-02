import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseAuthRequestDto } from './base.auth.request.dto';

export class SignUpRequestDto extends BaseAuthRequestDto {
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
