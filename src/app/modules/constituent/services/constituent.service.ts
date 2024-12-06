import { PrismaService } from '@/prisma/prisma.service';
import { MAX_STORIES_FOR_ETHNIC_GROUP, PCodeMessages } from '@/util/Constants';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { MessageException } from '@/util/MessageException';
import { DataBaseExceptionHandler } from '@/util/exception/DataBaseExceptionHandler';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotImplementedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AddConstituentDto } from '../dto/AddConstituentDto';
import { AddEthnicGroupToConstituentDto } from '../dto/AddEthnicGroupToConstituentDto';
import { ConstituentDto } from '../dto/ConstituentDto';
import { ConstituentFilledDto } from '../dto/ConstituentFilledDto';
import { DeleteEthnicGroupToConstituentDto } from '../dto/DeleteEthnicGroupToConstituentDto';
import { EditConstituentDto } from '../dto/EditConstituentDto';
import { EthnicGroupToConstituentDto } from '../dto/EthnicGroupToConstituentDto';

@Injectable()
export class ConstituentsService {
  private readonly logger = new Logger('ConstituentsService');
  private readonly msgException = new MessageException();
  private readonly dbExceptionHandler = new DataBaseExceptionHandler(
    PCodeMessages,
  );

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

  async deleteEthnicGroupFromConstituentById(
    dto: DeleteEthnicGroupToConstituentDto,
  ) {
    this.logger.debug('DELETE ETHNIC GROUP FROM CONSTITUENT BY ID');
    this.prisma.constituentsRFOnEthnicGroup
      .deleteMany({
        where: {
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

  async getConstituents(): Promise<ConstituentDto[]> {
    this.logger.warn('GET CONSTITUENTS');
    return this.prisma.constituentsRF.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getPercentOfFilledConstituent(): Promise<ConstituentFilledDto[]> {
    try {
      this.logger.debug('GET PERCENT OF FILLED CONSTITUENT');
      const maxStoriesForOneGroup = MAX_STORIES_FOR_ETHNIC_GROUP;
      const constituentsFilled: {
        constituent_rf_id: number;
        count_ethnic_groups: number;
        filled_area: number;
      }[] = await this.prisma
        .$queryRaw`SELECT cerf.constituent_rf_id, COUNT(DISTINCT stories.ethnic_group_id) as count_ethnic_groups, (1.0 * COUNT(DISTINCT stories.audio_id))/(COUNT(DISTINCT stories.ethnic_group_id) * ${maxStoriesForOneGroup}) as filled_area
    FROM constituents_rf_ethnic_groups as cerf INNER JOIN stories ON cerf.ethnic_group_id = stories.ethnic_group_id
    GROUP BY cerf.constituent_rf_id`;
      const constituents: ConstituentFilledDto[] = constituentsFilled.map(
        (item) => {
          console.log(item);
          return new ConstituentFilledDto(
            Number(item['constituent_rf_id']),
            Number(item['count_ethnic_groups']),
            Number(item['filled_area']),
          );
        },
      );
      return constituents;
    } catch (error) {
      PrintNameAndCodePrismaException(error, this.logger);
      throw this.dbExceptionHandler.handleError(error);
    }
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
