import { ApiProperty } from '@nestjs/swagger';
import { BaseUserDto } from './BaseUserDto';

export class UserDto extends BaseUserDto {
  @ApiProperty({ description: '', nullable: false })
  id: number;
}
