import { PCodeMessages } from '@/util/Constants';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { DataBaseExceptionHandler } from '@/util/exception/DataBaseExceptionHandler';
import { Injectable, Logger } from '@nestjs/common';
import { AddStoryRequestRepository } from './add-story-request.repository';
import { AddStoryRequestDto } from './dto/AddStoryRequestDto';
import { CreateAddStoryRequestDto } from './dto/CreateAddStoryRequestDto';
import { EditAddStoryRequestDto } from './dto/EditAddStoryRequestDto';
import { AddStoryRequestEntity } from './entity/AddStoryRequestEntity';

@Injectable()
export class AddStoryRequestService {
  private readonly logger = new Logger(AddStoryRequestService.name);
  private readonly dbExceptionHandler = new DataBaseExceptionHandler(
    PCodeMessages,
  );

  constructor(private repository: AddStoryRequestRepository) {}

  async getAddStoryRequests(
    start: number,
    count: number,
  ): Promise<AddStoryRequestEntity[]> {
    this.logger.debug('GET ADD STORY REQUESTS');
    return await this.repository.findMany({
      skip: start - 1,
      take: count,
    });
  }

  async getAddStoryRequestsByUserId(
    userId: number,
  ): Promise<AddStoryRequestDto[]> {
    return await this.repository
      .findMany({
        where: {
          userId: userId,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        throw this.dbExceptionHandler.handleError(error);
      });
  }

  async createAddStoryRequest(userId: number, dto: CreateAddStoryRequestDto) {
    this.logger.debug('CREATE ADD STORY REQUEST');
    try {
      return await this.repository.create({
        select: {
          id: true,
          storyName: true,
          status: true,
          comment: true,
        },
        data: {
          storyName: dto.storyName,
          userId: userId,
        },
      });
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }

  async editStatusById(
    id: number,
    dto: EditAddStoryRequestDto,
  ): Promise<EditAddStoryRequestDto> {
    this.logger.debug('EDIt StATUS BY ID');
    try {
      return this.repository.editStatusRequestById(id, dto);
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }
}
