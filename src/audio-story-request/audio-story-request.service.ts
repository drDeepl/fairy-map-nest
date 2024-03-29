import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TypeRequestDto } from '../request/dto/type-request/TypeRequestDto';
import { PrismaService } from '@/prisma/prisma.service';
import { AddTypeRequestDto } from '../request/dto/type-request/AddTypeRequestDto';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MessageException } from '@/util/MessageException';
import { EditTypeRequestDto } from '../request/dto/type-request/EditTypeRequestDto';
import { DataBaseExceptionHandler } from '@/util/exception/DataBaseExceptionHandler';
import { AddAudioStoryRequestDto } from './dto/audio-story-request/AddAudioStoryRequestDto';
import { AudioStoryRequestEntity } from './entity/AudioStoryRequestEntity';
import { PCodeMessages } from '@/util/Constants';

@Injectable()
export class AudioStoryRequestService {
  private readonly logger = new Logger('AudioStoryRequestService');
  private readonly msgException = new MessageException();
  private readonly dbExceptionHandler = new DataBaseExceptionHandler(
    PCodeMessages,
  );

  constructor(private readonly prisma: PrismaService) {}

  async createAddAudioRequest(
    dto: AddAudioStoryRequestDto,
  ): Promise<AudioStoryRequestEntity> {
    // FIX: CREATE ENUM STATUS OR STORE IN DB?
    this.logger.debug('CREATE ADD AUDIO REQUEST');
    return;
  }
}
