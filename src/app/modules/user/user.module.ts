import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { UserAudioModule } from '../user-audio/user-audio.module';
import { AudioStoryRequestModule } from '../audio-story-application/audio-story-request.module';

@Module({
  imports: [UserAudioModule, AudioStoryRequestModule],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
