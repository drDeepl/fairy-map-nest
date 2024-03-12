import { PrismaService } from '@/prisma/prisma.service';
import { MessageException } from '@/util/MessageException';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AddEthnicGroupMapDto } from './dto/AddEthnicGroupMapDto';
import { EthnicGroupMapDto } from './dto/EthnicGroupMapDto';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { EthnicGroupMapWithGroupDto } from './dto/EthnicGroupMapWithGroupDto';

@Injectable()
export class MapService {
  private readonly logger = new Logger('MapService');
  private readonly msgException = new MessageException();

  constructor(private prisma: PrismaService) {}

  async addEthnicalGroupPoint(
    id: number,
    dto: AddEthnicGroupMapDto,
  ): Promise<EthnicGroupMapDto> {
    return this.prisma.ethnicGroupMapPoint
      .create({
        data: {
          ethnicGroupId: id,
          longitude: dto.longitude,
          latitude: dto.latitude,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        if (error.code === 'P2003') {
          throw new HttpException(
            'Несуществующая этническая группа',
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

  async getEthnicalGroupPoints(): Promise<EthnicGroupMapWithGroupDto[]> {
    this.logger.debug('GET ETHNICAL GROUP POINT');
    return this.prisma.ethnicGroupMapPoint.findMany({
      select: {
        id: true,
        longitude: true,
        latitude: true,
        ethnicGroup: true,
      },
    });
  }
  async deleteEthnicalGroupPoint(id: number) {
    this.logger.debug('DELETE ETHNICAL GROUP POINT');
    return this.prisma.ethnicGroupMapPoint
      .delete({
        where: {
          id: id,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        if (error.code === 'P2025') {
          throw new HttpException('Несуществующая точка', HttpStatus.FORBIDDEN);
        } else {
          throw new HttpException(
            this.msgException.UnhandledError,
            HttpStatus.BAD_GATEWAY,
          );
        }
      });
  }
}
