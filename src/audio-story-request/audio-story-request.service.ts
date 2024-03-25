import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TypeRequestDto } from '../request/dto/type-request/TypeRequestDto';
import { PrismaService } from '@/prisma/prisma.service';
import { AddTypeRequestDto } from '../request/dto/type-request/AddTypeRequestDto';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MessageException } from '@/util/MessageException';
import { EditTypeRequestDto } from '../request/dto/type-request/EditTypeRequestDto';

@Injectable()
export class AudioStoryRequestService {
  private readonly logger = new Logger('AudioStoryRequestService');
  private readonly msgException = new MessageException();

  constructor(private readonly prisma: PrismaService) {}
}
