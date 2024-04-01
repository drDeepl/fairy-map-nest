import { ApiProperty } from '@nestjs/swagger';
import { BaseStoryDto } from './BaseStoryDto';
import { IsInt } from 'class-validator';
import { EthnicGroupDto } from '@/ethnic-group/dto/EthnicGroupDto';

export class StoryDto extends BaseStoryDto {
  @ApiProperty({ description: '', nullable: false })
  @IsInt()
  id: number;

  @ApiProperty({ description: '', nullable: true })
  audioId: number | null;

  @ApiProperty({ description: '', nullable: false })
  ethnicGroup: EthnicGroupDto;
}
