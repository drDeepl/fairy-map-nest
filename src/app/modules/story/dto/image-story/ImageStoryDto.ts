import { ApiProperty } from '@nestjs/swagger';

export class ImageStoryDto {
  @ApiProperty({ description: '', nullable: false })
  filename: string;
  @ApiProperty({ description: '', nullable: false })
  buffer: Buffer;
}
