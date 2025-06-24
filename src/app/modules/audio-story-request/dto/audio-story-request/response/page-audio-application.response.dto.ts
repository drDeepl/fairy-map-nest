import { AudioApplicationWithUserAudioResponseDto } from '@/app/modules/audio-story-request/dto/audio-story-request/audio-application-with-user-audio.dto';
import { PageResponseDto } from '@/common/dto/response/page.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AudioApplicationPageResponseDto extends PageResponseDto<AudioApplicationWithUserAudioResponseDto> {
  @ApiProperty({
    type: [AudioApplicationWithUserAudioResponseDto],
  })
  data: AudioApplicationWithUserAudioResponseDto[];
}
