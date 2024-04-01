import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserAudioRepository {
  private readonly logger = new Logger(UserAudioRepository.name);
  constructor(private readonly prisma: PrismaService) {}
  findUnique = this.prisma.userAudioStory.findUnique;
  findFirst = this.prisma.userAudioStory.findFirst;
  findMany = this.prisma.userAudioStory.findMany;
  create = this.prisma.userAudioStory.create;
  update = this.prisma.userAudioStory.update;
  upsert = this.prisma.userAudioStory.upsert;
  delete = this.prisma.userAudioStory.delete;
}
