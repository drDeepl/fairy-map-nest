import { ApiProperty } from '@nestjs/swagger';

export class AuthorUserDto {
  @ApiProperty({ description: 'номер пользователя', nullable: false })
  id: number;
  @ApiProperty({ description: 'имя пользователя', nullable: false })
  firstName: string;
  @ApiProperty({ description: 'фамилия пользователя', nullable: false })
  lastName: string;
}
