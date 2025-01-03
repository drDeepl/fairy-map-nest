import { PrismaService } from '@/prisma/prisma.service';
import { REQUEST_STATUS } from '@/util/Constants';

import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatusRequestAll(): Promise<string[]> {
    return Object.keys(REQUEST_STATUS);
  }
}
