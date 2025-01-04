import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsBoolean } from "class-validator";
import { PageMetaDtoParameters } from "./interfaces/page-meta-dto-parameters.interface";

export class PageMetaDto {
  @ApiProperty({
    description: 'номер текущей страницы',
  })
  @IsInt()
  page: number;

  @ApiProperty({
    description: 'количество элементов на странице',
  })
  @IsInt()
  take: number;

  @ApiProperty({
    description: 'количество элементов всего',
  })
  @IsInt()
  itemCount: number;

  @ApiProperty({
    description: 'количество страниц',
  })
  @IsInt()
  pageCount: number;

  @ApiProperty({
    description: 'есть предыдущая страница',
  })
  @IsBoolean()
  hasPreviousPage: boolean;

  @ApiProperty({
    description: 'есть следующая страница',
  })
  @IsBoolean()
  hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
