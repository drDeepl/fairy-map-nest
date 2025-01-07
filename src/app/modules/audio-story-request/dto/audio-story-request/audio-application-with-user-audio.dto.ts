import { ApiProperty } from '@nestjs/swagger';
import { Status, TypeRequest } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';
import { UserAudioWithLanguageResponseDto } from './response/user-audio.response.dto';
import { AuthorAudioStoryResponseDto } from '@/app/modules/user/dto/response/author-audio-story.response.dto';
import { StoryDto } from '@/app/modules/story/dto/story/StoryDto';

export class AudioApplicationWithUserAudioResponseDto {
  @ApiProperty({ description: 'ид заявки', nullable: false })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'данные о озвучки пользователя',
    nullable: false,
    type: () => UserAudioWithLanguageResponseDto,
  })
  userAudio: UserAudioWithLanguageResponseDto;

  @ApiProperty({
    description: 'информация о пользователе',
    nullable: false,
    type: () => AuthorAudioStoryResponseDto,
  })
  user: AuthorAudioStoryResponseDto;

  @ApiProperty({ description: 'статус заявки', nullable: false })
  status: Status;

  @ApiProperty({ description: 'комментарий, проверяющего', nullable: false })
  @IsString()
  comment: string;

  @ApiProperty({ description: 'дата создания заявки', nullable: false })
  @IsString()
  createdAt: Date;

  @ApiProperty({ description: 'дата редактирования заявки', nullable: false })
  @IsString()
  updatedAt: Date;

  @ApiProperty({ description: 'ид сказки' })
  storyId: number;

  @ApiProperty({ description: 'название сказки', nullable: false })
  @IsString()
  storyName: string;

  constructor(dto: Partial<AudioApplicationWithUserAudioResponseDto>) {
    this.id = dto.id;
    this.userAudio = dto.userAudio;
    this.user = dto.user;
    this.status = dto.status;
    this.comment = dto.comment;
    this.createdAt = dto.createdAt;
    this.updatedAt = dto.updatedAt;
    this.storyId = dto.storyId;
    this.storyName = dto.storyName;
  }
}
