import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class SearchStoryOptionsRequestDto {
  @ApiPropertyOptional({
    description: 'название сказки',
  })
  @IsString()
  @IsOptional()
  name?: string = '';
}
