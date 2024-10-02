import { ApiProperty } from '@nestjs/swagger';

export class TokensResponseDto {
  @ApiProperty({ description: 'access token', nullable: false })
  accessToken: string;
  @ApiProperty({ description: 'refresh token', nullable: false })
  refreshToken: string;

  constructor(dto: Partial<TokensResponseDto>) {
    this.accessToken = dto.accessToken;
    this.refreshToken = dto.refreshToken;
  }
}
