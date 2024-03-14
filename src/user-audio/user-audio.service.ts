import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import fs from 'fs';
import { join } from 'path';

@Injectable()
export class UserAudioService {
  private readonly logger = new Logger('UserAudioService');

  constructor(private prisma: PrismaService) {}

  async saveAudio(audio, userId: number) {
    this.logger.debug('SAVE AUDIO');
    console.log(audio);
    const path: string = join(
      process.cwd(),
      `uploaded-user-audios/${userId}/${audio.originalname}`,
    );
    this.logger.error(path);
  }
}
