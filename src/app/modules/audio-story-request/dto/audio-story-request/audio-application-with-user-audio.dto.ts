import { ApiProperty } from '@nestjs/swagger';
import { Status, TypeRequest } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';
import { UserAudioWithLanguageResponseDto } from './response/user-audio.response.dto';
import { AuthorAudioStoryResponseDto } from '@/app/modules/user/dto/response/author-audio-story.response.dto';

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

  constructor(dto: Partial<AudioApplicationWithUserAudioResponseDto>) {
    this.id = dto.id;
    this.userAudio = dto.userAudio;
    this.user = dto.user;
    this.status = dto.status;
    this.comment = dto.comment;
  }
}
