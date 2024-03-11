import { ApiProperty } from '@nestjs/swagger';
import { BaseConstituentDto } from './BaseConstituentDto';
import { IsInt } from 'class-validator';

export class EditConstituentDto extends BaseConstituentDto {
  @ApiProperty({ description: '', nullable: false })
  @IsInt()
  languageId: number;
}
