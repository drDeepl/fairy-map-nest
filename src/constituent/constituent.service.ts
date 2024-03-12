import { PrismaService } from '@/prisma/prisma.service';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { MessageException } from '@/util/MessageException';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AddConstituentDto } from './dto/AddConstituentDto';
import { ConstituentDto } from './dto/ConstituentDto';
import { EditConstituentDto } from './dto/EditConstituentDto';
import { AddEthnicGroupToConstituentDto } from './dto/AddEthnicGroupToConstituentDto';
import { EthnicGroupToConstituentDto } from './dto/EthnicGroupToConstituentDto';

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

  async addEthnicGroupToConstituent(
    dto: AddEthnicGroupToConstituentDto,
  ): Promise<EthnicGroupToConstituentDto> {
    this.logger.debug('ADD ETHNIC GROUP TO CONSTITUENT');
    return this.prisma.constituentsRFOnEthnicGroup
      .create({
        data: {
          constituentRfId: dto.constituentRfId,
          ethnicGroupId: dto.ethnicGroupId,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        if (error.code === 'P2003') {
          throw new HttpException(
            'Несуществующий субъект или этническая группа',
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

  async getEthnicGroupByConstituentId(constituentId) {
    this.logger.debug('GET ETHNIC GROUP BY CONSTITUENT ID');
    return this.prisma.constituentsRFOnEthnicGroup.findMany({
      where: {
        constituentRfId: constituentId,
      },
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
