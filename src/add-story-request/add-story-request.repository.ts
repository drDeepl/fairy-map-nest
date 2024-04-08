import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Status } from '@prisma/client';
import { EditAddStoryRequestDto } from './dto/EditAddStoryRequestDto';
import { AddStoryRequestEntity } from './entity/AddStoryRequestEntity';
import { PCodeMessages } from '@/util/Constants';
import { DataBaseExceptionHandler } from '@/util/exception/DataBaseExceptionHandler';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';

@Injectable()
export class AddStoryRequestRepository {
  private readonly logger = new Logger(AddStoryRequestRepository.name);
  private readonly dbExceptionHandler = new DataBaseExceptionHandler(
    PCodeMessages,
  );

  constructor(private prisma: PrismaService) {}
  findMany = this.prisma.addStoryRequest.findMany;
  create = this.prisma.addStoryRequest.create;

  async editStatusRequestById(
    id: number,
    dto: EditAddStoryRequestDto,
  ): Promise<AddStoryRequestEntity> {
    this.logger.debug('EDIT STATUS REQUEST BY ID');
    if (Status[dto.status]) {
      return await this.prisma.addStoryRequest.update({
        where: {
          id: id,
        },
        data: {
          status: Status[dto.status],
          comment: dto.comment,
        },
      });
      // .catch((error) => {
      //   PrintNameAndCodePrismaException(error, this.logger);
      //   throw this.dbExceptionHandler.handleError(error);
      // });
    }
    throw new NotFoundException('Неверный статус');
  }
  async deleteById(id: number): Promise<void> {
    this.logger.debug('DELETE BY ID');
    await this.prisma.addStoryRequest
      .delete({
        where: {
          id: id,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        throw this.dbExceptionHandler.handleError(error);
      });
  }
}
