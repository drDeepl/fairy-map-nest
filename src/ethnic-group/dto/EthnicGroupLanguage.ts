import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { LanguageDto } from './LanguageDto';

export class EthnicGroupLanguageDto {
  @ApiProperty({ description: '', nullable: false })
  @IsInt()
  id: number;
  @ApiProperty({ description: '', nullable: false })
  @IsNotEmpty({
    message: 'пароль не может быть пустым',
  })
  name: string;
  @ApiProperty({ description: '', nullable: false })
  language: LanguageDto;
}
