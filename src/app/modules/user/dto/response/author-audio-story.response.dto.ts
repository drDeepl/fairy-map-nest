import { ApiProperty } from '@nestjs/swagger';

export class AuthorAudioStoryResponseDto {
  @ApiProperty({ description: 'id пользователя', nullable: false })
  id: number;
  @ApiProperty({ description: 'имя пользователя', nullable: false })
  firstName: string;
  @ApiProperty({ description: 'фамилия пользователя', nullable: false })
  lastName: string;

  constructor(dto: Partial<AuthorAudioStoryResponseDto>) {
    this.id = dto.id;
    this.firstName = dto.firstName;
    this.lastName = dto.lastName;
  }
}
