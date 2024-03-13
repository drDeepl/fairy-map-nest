import { Module } from '@nestjs/common';
import { UserAudioController } from './user-audio.controller';
import { UserAudioService } from './user-audio.service';

@Module({
  controllers: [UserAudioController],
  providers: [UserAudioService]
})
export class UserAudioModule {}
