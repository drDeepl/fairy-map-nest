import { ApiProperty } from '@nestjs/swagger';

export class TokensResponseDto {
  @ApiProperty({ description: 'access token', nullable: false })
  accessToken: string;

  constructor(dto: Partial<TokensResponseDto>) {
    this.accessToken = dto.accessToken;
  }
}
