import { PrismaService } from '@/prisma/prisma.service';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { MessageException } from '@/util/MessageException';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AddConstituentDto } from './dto/AddConstituentDto';
import { ConstituentDto } from './dto/ConstituentDto';
import { EditConstituentDto } from './dto/EditConstituentDto';

@Injectable()
export class ConstituentsService {
  private readonly logger = new Logger('ConstituentsService');
  private readonly msgException = new MessageException();

  constructor(private prisma: PrismaService) {}

  async addNewConstituent(dto: AddConstituentDto): Promise<ConstituentDto> {
    this.logger.warn('ADD NEW CONSTITUENT');
    return this.prisma.constituentsRF
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
              'субъект с таким названием уже существует',
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

  async getConstituents(): Promise<ConstituentDto[]> {
    this.logger.warn('GET CONSTITUENTS');
    return this.prisma.constituentsRF.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async editConstituentById(id: number, dto: EditConstituentDto) {
    return this.prisma.constituentsRF
      .update({
        where: { id: id },
        data: { name: dto.name },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        if (error.code === 'P2002') {
          throw new HttpException(
            'субъект с таким названеим уже существует',
            HttpStatus.FORBIDDEN,
          );
        }
        throw new HttpException(
          this.msgException.UnhandledError,
          HttpStatus.BAD_GATEWAY,
        );
      });
  }

  async deleteConstituentById(id: number) {
    this.logger.warn('DELETE CONSTITUENT BY ID');
    this.prisma.constituentsRF
      .delete({
        where: {
          id: id,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        throw new HttpException(
          this.msgException.UnhandledError,
          HttpStatus.BAD_GATEWAY,
        );
      });
  }
}
