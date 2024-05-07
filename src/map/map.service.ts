import { PrismaService } from '@/prisma/prisma.service';
import { PCodeMessages } from '@/util/Constants';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { MessageException } from '@/util/MessageException';
import { DataBaseExceptionHandler } from '@/util/exception/DataBaseExceptionHandler';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AddEthnicGroupMapDto } from './dto/AddEthnicGroupMapDto';
import { EthnicGroupMapDto } from './dto/EthnicGroupMapDto';
import { EthnicGroupMapWithGroupDto } from './dto/EthnicGroupMapWithGroupDto';
import { EthnicGroupMapPointEntity } from './entity/EthnicGroupMapPointEntity';
import { EthnicGroupMapPointEntityWithConstituents } from './entity/EthnicGroupMapPointEntityWithConstituents';

@Injectable()
export class MapService {
  private readonly logger = new Logger('MapService');
  private readonly msgException = new MessageException();
  private readonly dbExceptionHandler = new DataBaseExceptionHandler(
    PCodeMessages,
  );

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
          constituentId: dto.constituentId,
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

  async generateMapPoints() {
    this.logger.debug('GENERATE MAP POINTS');
    const points = [
      {
        id: 2,
        name: 'Республика Мордовия',
        ethnicGroupsId: [1, 2, 22],
        middleLon: 43.755,
        middleLat: 54.294,
      },
      // {
      //   id: 3,
      //   name: 'Тульская область',
      //   ethnicGroupsId: [5, 6, 9, 1, 2, 16, 23, 45],
      //   middleLon: 38.202,
      //   middleLat: 53.826,
      // },
      // {
      //   id: 7,
      //   name: 'Кировская область',
      //   ethnicGroupsId: [6, 1, 2, 20, 21],
      //   middleLon: 49.209,
      //   middleLat: 58.211,
      // },
      // {
      //   id: 8,
      //   name: 'Республика Коми',
      //   ethnicGroupsId: [6, 1, 2, 16, 19, 23, 45, 76, 77, 131, 134, 142],
      //   middleLon: 54.995,
      //   middleLat: 63.983,
      // },
      // {
      //   id: 9,
      //   name: 'Костромская область',
      //   ethnicGroupsId: [6, 1],
      //   middleLon: 43.1,
      //   middleLat: 58.447,
      // },
      // {
      //   id: 15,
      //   name: 'Пермский край',
      //   ethnicGroupsId: [1, 2],
      //   middleLon: 56.35,
      //   middleLat: 59.318,
      // },
      // {
      //   id: 16,
      //   name: 'Псковская область',
      //   ethnicGroupsId: [5, 6, 9, 1, 23, 125, 136],
      //   middleLon: 29.143,
      //   middleLat: 57.231,
      // },
      // {
      //   id: 18,
      //   name: 'Рязанская область',
      //   ethnicGroupsId: [5, 6, 1, 2, 22, 45, 84],
      //   middleLon: 40.699,
      //   middleLat: 54.364,
      // },
      // {
      //   id: 20,
      //   name: 'Самарская область',
      //   ethnicGroupsId: [5, 6, 1, 2, 14, 16, 18, 19, 22, 23, 45, 84],
      //   middleLon: 50.016,
      //   middleLat: 53.166,
      // },
      // {
      //   id: 22,
      //   name: 'Тамбовская область',
      //   ethnicGroupsId: [5, 6, 9, 1],
      //   middleLon: 41.592,
      //   middleLat: 52.599,
      // },
      // {
      //   id: 23,
      //   name: 'Республика Татарстан',
      //   ethnicGroupsId: [6, 1, 2, 18, 19, 20, 21, 22, 45, 90, 139],
      //   middleLon: 50.069,
      //   middleLat: 55.552,
      // },
      // {
      //   id: 25,
      //   name: 'Нижегородская область',
      //   ethnicGroupsId: [5, 6, 1, 2, 19, 20, 22, 45],
      //   middleLon: 43.535,
      //   middleLat: 55.776,
      // },
      // {
      //   id: 26,
      //   name: 'Республика Карелия',
      //   ethnicGroupsId: [6, 1, 23, 72, 75],
      //   middleLon: 33.116,
      //   middleLat: 63.989,
      // },
      // {
      //   id: 27,
      //   name: 'Архангельская область',
      //   ethnicGroupsId: [6, 1, 2, 23, 76, 115, 131],
      //   middleLon: 40.827,
      //   middleLat: 63.106,
      // },
      // {
      //   id: 29,
      //   name: 'Белгородская область',
      //   ethnicGroupsId: [5, 6, 1, 45, 66],
      //   middleLon: 37.794,
      //   middleLat: 50.227,
      // },
      // {
      //   id: 30,
      //   name: 'Брянская область',
      //   ethnicGroupsId: [5, 6, 9, 1, 23, 93],
      //   middleLon: 33.91,
      //   middleLat: 52.925,
      // },
      // {
      //   id: 33,
      //   name: 'Челябинская область',
      //   ethnicGroupsId: [5, 6, 1, 2, 14, 16, 18, 22, 23, 127],
      //   middleLon: 60.111,
      //   middleLat: 53.45,
      // },
      // {
      //   id: 34,
      //   name: 'Республика Чувашия',
      //   ethnicGroupsId: [6, 1, 2, 19, 20, 22],
      //   middleLon: 47.074,
      //   middleLat: 55.491,
      // },
      // {
      //   id: 37,
      //   name: 'Пензенская область',
      //   ethnicGroupsId: [5, 6, 1, 2, 19, 22],
      //   middleLon: 45.233,
      //   middleLat: 53.156,
      // },
      // {
      //   id: 41,
      //   name: 'Курская область',
      //   ethnicGroupsId: [5, 6, 1],
      //   middleLon: 34.963,
      //   middleLat: 51.289,
      // },
      // {
      //   id: 42,
      //   name: 'Ленинградская область',
      //   ethnicGroupsId: [5, 6, 9, 1, 2, 23, 45, 75, 84, 85, 117, 122],
      //   middleLon: 29.032,
      //   middleLat: 60.46,
      // },
      // {
      //   id: 43,
      //   name: 'Республика Марий Эл',
      //   ethnicGroupsId: [6, 1, 2, 19, 20, 79, 80],
      //   middleLon: 48.629,
      //   middleLat: 56.551,
      // },
      // {
      //   id: 44,
      //   name: 'город Москва',
      //   ethnicGroupsId: [
      //     3, 5, 6, 1, 2, 14, 18, 19, 22, 23, 45, 47, 67, 68, 84, 85, 93, 106,
      //     117, 128,
      //   ],
      //   middleLon: 37.239,
      //   middleLat: 55.461,
      // },
      // {
      //   id: 45,
      //   name: 'Московская область',
      //   ethnicGroupsId: [5, 6, 1, 2, 19, 22, 23, 45, 85, 93, 117],
      //   middleLon: 38.676,
      //   middleLat: 55.279,
      // },
      // {
      //   id: 46,
      //   name: 'Мурманская область',
      //   ethnicGroupsId: [6, 1, 2, 22, 23, 45, 72, 76, 124, 142],
      //   middleLon: 34.952,
      //   middleLat: 67.877,
      // },
      // {
      //   id: 47,
      //   name: 'Ненецкий автономный округ',
      //   ethnicGroupsId: [1, 76, 131],
      //   middleLon: 61.205,
      //   middleLat: 67.94,
      // },
      // {
      //   id: 48,
      //   name: 'Новгородская область',
      //   ethnicGroupsId: [6, 9, 1, 23],
      //   middleLon: 31.983,
      //   middleLat: 58.235,
      // },
      // {
      //   id: 51,
      //   name: 'Орловская область',
      //   ethnicGroupsId: [6, 1],
      //   middleLon: 36.504,
      //   middleLat: 52.803,
      // },
      // {
      //   id: 52,
      //   name: 'город Санкт Петербург',
      //   ethnicGroupsId: [3, 5, 6, 1, 2, 14, 23, 45, 84, 85, 93, 117],
      //   middleLon: 30.318,
      //   middleLat: 59.816,
      // },
      // {
      //   id: 56,
      //   name: 'Смоленская область',
      //   ethnicGroupsId: [5, 6, 1, 23],
      //   middleLon: 33.388,
      //   middleLat: 54.897,
      // },
      // {
      //   id: 59,
      //   name: 'Тверская область',
      //   ethnicGroupsId: [5, 6, 9, 1, 2, 23, 45, 72, 84],
      //   middleLon: 34.459,
      //   middleLat: 57.058,
      // },
      // {
      //   id: 60,
      //   name: 'Республика Удмуртия',
      //   ethnicGroupsId: [6, 1, 2, 18, 20, 21, 92],
      //   middleLon: 52.695,
      //   middleLat: 57.179,
      // },
      // {
      //   id: 61,
      //   name: 'Калужская область',
      //   ethnicGroupsId: [5, 6, 1, 2, 23, 45, 84],
      //   middleLon: 35.431,
      //   middleLat: 54.476,
      // },
      // {
      //   id: 62,
      //   name: 'Липецкая область',
      //   ethnicGroupsId: [5, 6, 1, 45],
      //   middleLon: 39.18,
      //   middleLat: 52.746,
      // },
      // {
      //   id: 64,
      //   name: 'Ульяновская область',
      //   ethnicGroupsId: [5, 6, 1, 2, 19, 22, 45],
      //   middleLon: 47.534,
      //   middleLat: 53.792,
      // },
      // {
      //   id: 65,
      //   name: 'Владимирская область',
      //   ethnicGroupsId: [5, 6, 1, 2, 23],
      //   middleLon: 41.169,
      //   middleLat: 55.873,
      // },
      // {
      //   id: 66,
      //   name: 'Вологодская область',
      //   ethnicGroupsId: [6, 1, 23, 75],
      //   middleLon: 40.827,
      //   middleLat: 63.106,
      // },
      // {
      //   id: 67,
      //   name: 'Ярославская область',
      //   ethnicGroupsId: [5, 6, 1, 2, 23, 45, 145],
      //   middleLon: 39.207,
      //   middleLat: 58.155,
      // },
      // {
      //   id: 68,
      //   name: 'Воронежская область',
      //   ethnicGroupsId: [5, 6, 9, 1],
      //   middleLon: 40.321,
      //   middleLat: 50.72,
      // },
      // {
      //   id: 71,
      //   name: 'Ивановская область',
      //   ethnicGroupsId: [5, 6, 1, 2, 45],
      //   middleLon: 41.627,
      //   middleLat: 57.074,
      // },
      // {
      //   id: 80,
      //   name: 'Калининградская область',
      //   ethnicGroupsId: [5, 6, 1, 2, 16, 23, 45, 84, 116, 120],
      //   middleLon: 21.971,
      //   middleLat: 54.776,
      // },
      // {
      //   id: 81,
      //   name: 'Оренбургская область',
      //   ethnicGroupsId: [5, 6, 1, 2, 14, 16, 18, 19, 22, 23, 45, 90],
      //   middleLon: 53.866,
      //   middleLat: 52.354,
      // },
      // {
      //   id: 83,
      //   name: 'Республика Башкортостан',
      //   ethnicGroupsId: [6, 1, 2, 18, 19, 20, 21, 22, 23],
      //   middleLon: 56.213,
      //   middleLat: 53.989,
      // },
    ];

    points.forEach((point) => {
      console.log(point.name);
      point.ethnicGroupsId.forEach((ethnicGroupId) => {
        console.log(ethnicGroupId);
        let bias = Math.random() / 100;
        if (ethnicGroupId % 2 === 0) {
          bias *= -1;
        }

        const dto: AddEthnicGroupMapDto = new AddEthnicGroupMapDto(
          point.middleLon + bias,
          point.middleLat + bias,
        );
        this.addEthnicalGroupPoint(ethnicGroupId, dto);
      });
    });
  }

  async getEthnicalGroupPoints(): Promise<EthnicGroupMapWithGroupDto[]> {
    this.logger.debug('GET ETHNICAL GROUP POINT');
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
    this.logger.debug('GET ETHNICAL GROUP POINT BY COSTITUENT ID');
    try {
      // const ethnicGroupsId =
      //   await this.prisma.constituentsRFOnEthnicGroup.findMany({
      //     select: { ethnicGroupId: true },
      //     where: {
      //       constituentRfId: constituentId,
      //     },
      //   });

      // const ids = ethnicGroupsId.map((item) => item.ethnicGroupId);
      // return await this.prisma.ethnicGroupMapPoint.findMany({
      //   where: {
      //     ethnicGroupId: { in: ids },
      //   },
      // });
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
    this.logger.debug('GET POINTS BY NAME ETHNIC GROUP');
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
