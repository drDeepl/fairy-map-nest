import { PrismaService } from '@/prisma/prisma.service';
import { PCodeMessages } from '@/util/Constants';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { MessageException } from '@/util/MessageException';
import { DataBaseExceptionHandler } from '@/util/exception/DataBaseExceptionHandler';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AddEthnicGroupMapDto } from '../dto/AddEthnicGroupMapDto';
import { EthnicGroupMapDto } from '../dto/EthnicGroupMapDto';
import { EthnicGroupMapWithGroupDto } from '../dto/EthnicGroupMapWithGroupDto';
import { EthnicGroupMapPointEntity } from '../entity/EthnicGroupMapPointEntity';
import { EthnicGroupMapPointEntityWithConstituents } from '../entity/EthnicGroupMapPointEntityWithConstituents';

@Injectable()
export class MapService {
  private readonly logger = new Logger('MapService');
  private readonly msgException = new MessageException();
  private readonly dbExceptionHandler = new DataBaseExceptionHandler(
    PCodeMessages,
  );

  constructor(private prisma: PrismaService) {}

  async addEthnicalGroupPoint(
    ethnicGroupId: number,
    constituentId: number,
    dto: AddEthnicGroupMapDto,
  ): Promise<EthnicGroupMapDto> {
    return this.prisma.ethnicGroupMapPoint
      .create({
        data: {
          ethnicGroupId: ethnicGroupId,
          longitude: dto.longitude,
          latitude: dto.latitude,
          constituentId: constituentId,
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
    return this.prisma.ethnicGroupMapPoint.findMany({
      select: {
        id: true,
        longitude: true,
        latitude: true,
        constituentId: true,
        ethnicGroup: true,
      },
    });
  }

  async getEthnicalGroupPointsByConstituentId(
    constituentId: number,
  ): Promise<EthnicGroupMapPointEntity[]> {
    try {
      return await this.prisma.ethnicGroupMapPoint.findMany({
        where: {
          constituentId: constituentId,
        },
      });
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }

  async getPointsByNameEthnicGroup(
    name: string,
  ): Promise<EthnicGroupMapPointEntityWithConstituents[]> {
    try {
      const ethnicGroups: Array<{ id: number }> = await this.prisma
        .$queryRaw`SELECT DISTINCT id FROM ethnic_groups WHERE name ~* ${name}`;
      const ethnicGroupIds = ethnicGroups.map((item) => item.id);
      const ethnicGroupMapPoints =
        await this.prisma.ethnicGroupMapPoint.findMany({
          select: {
            id: true,
            ethnicGroupId: true,
            longitude: true,
            latitude: true,
            constituent: true,
          },
          where: {
            ethnicGroupId: { in: ethnicGroupIds },
          },
        });
      console.log(ethnicGroupMapPoints);
      return ethnicGroupMapPoints;
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
  }

  async deleteEthnicalGroupPoint(id: number) {
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
