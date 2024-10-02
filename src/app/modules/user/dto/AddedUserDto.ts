import { ApiProperty } from '@nestjs/swagger';
import { BaseUserDto } from './BaseUserDto';
import { UserDto } from './UserDto';

export class AddedUserDto extends UserDto {
  @ApiProperty({ description: '', nullable: false })
  refreshTokenHash: string;
}
