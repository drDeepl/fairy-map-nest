import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsInt, Max, Min } from 'class-validator';

export class SearchStoryOptionsRequestDto {
  @ApiPropertyOptional({
    description: 'название сказки',
  })
  @IsString()
  @IsOptional()
  name?: string = '';

  @ApiPropertyOptional({
    description: 'номер страницы',
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'номер страницы должен быть числом' })
  @Min(1, { message: 'минимальное значения для страницы - 1' })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'число элементов на странице',
    minimum: 1,
    maximum: 15,
    default: 10,
  })
  @Type(() => Number)
  @IsInt({ message: 'количество элементов на странице должно быть числом' })
  @Min(1, { message: 'минимальное значения для числа элементов - 1' })
  @Max(15, { message: 'максимальное значения для числа элементов - 15' })
  @IsOptional()
  take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
