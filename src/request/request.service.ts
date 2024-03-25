import { PrismaService } from '@/prisma/prisma.service';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { MessageException } from '@/util/MessageException';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AddTypeRequestDto } from './dto/type-request/AddTypeRequestDto';
import { EditTypeRequestDto } from './dto/type-request/EditTypeRequestDto';
import { TypeRequestDto } from './dto/type-request/TypeRequestDto';
import { EntityStatusRequestDto } from './dto/status-request/EntityStatusRequestDto';
import { AddStatusRequestDto } from './dto/status-request/AddStatusRequestDto';
import { EditStatusRequestDto } from './dto/status-request/EditStatusRequestDto';

@Injectable()
export class RequestService {
  private readonly logger = new Logger('RequestService');
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

  async getStatusRequestAll(): Promise<EntityStatusRequestDto[]> {
    this.logger.debug('GET STATUS REQUEST ALL');
    return await this.prisma.requestStatus.findMany().catch((error) => {
      PrintNameAndCodePrismaException(error, this.logger);
      throw new HttpException('Что-то пошло не так', HttpStatus.BAD_GATEWAY);
    });
  }

  async getStatusRequestById(id: number): Promise<EntityStatusRequestDto> {
    this.logger.debug('GET STATUS REQUEST BY ID');
    return await this.prisma.requestStatus
      .findUnique({
        where: {
          id: id,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        throw new HttpException('Что-то пошло не так', HttpStatus.BAD_GATEWAY);
      });
  }

  async addStatusRequest(
    dto: AddStatusRequestDto,
  ): Promise<EntityStatusRequestDto> {
    this.logger.debug('AD STATUS REQUEST');
    return await this.prisma.requestStatus
      .create({
        data: {
          name: dto.name,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        throw new HttpException('Что-то пошло не так', HttpStatus.BAD_GATEWAY);
      });
  }

  async editStatusRequest(
    id: number,
    dto: EditStatusRequestDto,
  ): Promise<EntityStatusRequestDto> {
    this.logger.debug('EDIT STATUS REQUEST');
    return this.prisma.requestStatus
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
        throw new HttpException('Что-то пошло не так', HttpStatus.BAD_GATEWAY);
      });
  }
}
