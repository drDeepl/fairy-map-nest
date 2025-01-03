import { Module } from '@nestjs/common';

import { UserAudioService } from './services/user-audio.service';

@Module({
  controllers: [],

  providers: [UserAudioService],
  exports: [UserAudioService],
})
export class UserAudioModule {}
