import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Status } from '@prisma/client';
import { EditAddStoryRequestDto } from './dto/EditAddStoryRequestDto';

@Injectable()
export class AddStoryRequestRepository {
  private readonly logger = new Logger(AddStoryRequestRepository.name);

  constructor(private prisma: PrismaService) {}
  findMany = this.prisma.addStoryRequest.findMany;
  create = this.prisma.addStoryRequest.create;

  async editStatusRequestById(id: number, dto: EditAddStoryRequestDto):Promise<EditAddStoryRequestDto> {
    this.logger.debug('EDIT STATUS REQUEST BY ID');
    if (Status[dto.status]) {
      return await this.prisma.addStoryRequest.update({
        select: {
          id: true,
          storyName: true,
          status: true,
          comment: true,
        },
        where: {
          id: id,
        },
        data: {
          status: Status[dto.status],
          comment: dto.comment,
        },
      });
    }
    throw new NotFoundException('Неверный статус');
  }
}
