import { ApiProperty } from '@nestjs/swagger';
import { BaseUserResponseDto } from './base-user.response.dto';

export class UserResponseDto extends BaseUserResponseDto {
  @ApiProperty({ description: '', nullable: false })
  id: number;

  constructor(dto: Partial<UserResponseDto>) {
    super(dto);
    this.id = dto.id;
  }
}
