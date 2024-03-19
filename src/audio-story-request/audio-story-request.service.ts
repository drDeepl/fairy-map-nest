import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TypeRequestDto } from './dto/type-request/TypeRequestDto';
import { PrismaService } from '@/prisma/prisma.service';
import { AddTypeRequestDto } from './dto/type-request/AddTypeRequestDto';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MessageException } from '@/util/MessageException';
import { EditTypeRequestDto } from './dto/type-request/EditTypeRequestDto';

@Injectable()
export class AudioStoryRequestService {
  private readonly logger = new Logger('AudioStoryRequestService');
  private readonly msgException = new MessageException();

  constructor(private readonly prisma: PrismaService) {}

  async addTypeRequest(dto: AddTypeRequestDto): Promise<TypeRequestDto> {
    this.logger.debug('ADD TYPE REQUEST');
    return this.prisma.typeRequest
      .create({
        data: {
          name: dto.name,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code == 'P2002') {
            throw new HttpException(
              'тип заявки с выбранным названием уже существует',
              HttpStatus.FORBIDDEN,
            );
          }
          throw new HttpException(
            'произошла ошибка в работе базы данных',
            HttpStatus.BAD_GATEWAY,
          );
        } else {
          throw new HttpException(
            this.msgException.UnhandledError,
            HttpStatus.BAD_GATEWAY,
          );
        }
      });
  }

  async editTypeRequest(
    id: number,
    dto: EditTypeRequestDto,
  ): Promise<TypeRequestDto> {
    this.logger.debug('EDIT TYPE REQUEST');
    return this.prisma.typeRequest
      .update({
        where: {
          id: id,
        },
        data: {
          name: dto.name,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code == 'P2002') {
            throw new HttpException(
              'тип заявки с выбранным названием уже существует',
              HttpStatus.FORBIDDEN,
            );
          }
          throw new HttpException(
            'произошла ошибка в работе базы данных',
            HttpStatus.BAD_GATEWAY,
          );
        } else {
          throw new HttpException(
            this.msgException.UnhandledError,
            HttpStatus.BAD_GATEWAY,
          );
        }
      });
  }

  async getAllRequestTypes(): Promise<TypeRequestDto[]> {
    this.logger.debug('GET ALL REQUEST TYPES');
    return this.prisma.typeRequest.findMany().catch((error) => {
      PrintNameAndCodePrismaException(error, this.logger);
      throw new HttpException(
        this.msgException.UnhandledError,
        HttpStatus.BAD_GATEWAY,
      );
    });
  }

  async getTypeRequestById(id: number) {
    this.logger.debug('GET TYPE REQUEST BY ID');
    return this.prisma.typeRequest.findUnique({
      where: {
        id: id,
      },
    });
  }

  async deleteTypeRequestById(id: number) {
    this.logger.debug('DELETE TYPE REQUEST BY ID');
    return this.prisma.typeRequest
      .delete({
        where: {
          id: id,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        if (error.code === 'P2025') {
          throw new HttpException(
            'Несуществующая запись',
            HttpStatus.FORBIDDEN,
          );
        } else {
          throw new HttpException(
            this.msgException.UnhandledError,
            HttpStatus.BAD_GATEWAY,
          );
        }
      });
  }
}
