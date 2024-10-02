import { ApiProperty } from '@nestjs/swagger';
export class TokensDto {
  @ApiProperty({ description: 'access token', nullable: false })
  accessToken: string;
  @ApiProperty({ description: 'refresh token', nullable: false })
  refreshToken: string;
}
