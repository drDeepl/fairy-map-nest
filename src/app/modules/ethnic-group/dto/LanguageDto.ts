import { ApiProperty } from '@nestjs/swagger';
import { BaseLanguageDto } from './BaseLanguageDto';
import { IsNumber } from 'class-validator';

export class LanguageDto extends BaseLanguageDto {
  @ApiProperty({ description: '', nullable: false })
  @IsNumber()
  id: number;
}
