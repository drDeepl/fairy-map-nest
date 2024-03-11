import { PrismaService } from '@/prisma/prisma.service';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AddEthnicGroupDto } from './dto/AddEthnicGroupDto';
import { EthnicGroupDto } from './dto/EthnicGroupDto';
import { PrintNameAndCodePrismaException } from '@/util/ExceptionUtils';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MessageException } from '@/util/MessageException';
import { AddLanguageDto } from './dto/AddLanguageDto';
import { LanguageDto } from './dto/LanguageDto';
import { EditEthnicGroupDto } from './dto/EditEthnicGroupDto';
import { EthnicGroupLanguageDto } from './dto/EthnicGroupLanguage';

@Injectable()
export class EthnicGroupService {
  private readonly logger = new Logger('EthnicGroupService');
  private readonly msgException = new MessageException();

  constructor(private readonly prisma: PrismaService) {}

  async getEthnicGroups(): Promise<EthnicGroupLanguageDto[]> {
    this.logger.debug('GET ETHNIC GROUPS');
    return this.prisma.ethnicGroup.findMany({
      select: {
        id: true,
        name: true,
        language: true,
      },
    });
    // return this.prisma.ethnicGroup.findMany({
    //   select: {
    //     id: true,
    //     language: true,
    //     languageId: false,
    //   },
    // });
  }

  async addEthnicGroup(dto: AddEthnicGroupDto): Promise<EthnicGroupDto> {
    this.logger.warn('ADD ETHNIC GROUP');
    return this.prisma.ethnicGroup
      .create({
        data: {
          name: dto.name,
          languageId: dto.languageId,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code == 'P2002') {
            throw new HttpException(
              'этническая группа с таким названием уже существует или язык этнической группы уже закреплен за этнической группой',
              HttpStatus.FORBIDDEN,
            );
          }
          if (error.code === 'P2003') {
            throw new HttpException(
              'выбранного языка не существует',
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

  async editEthnicGroup(
    id: number,
    dto: EditEthnicGroupDto,
  ): Promise<EthnicGroupDto> {
    this.logger.debug('EDIT ETHNIC GROUP DTO');
    const language: LanguageDto = await this.prisma.language.findUnique({
      where: { id: dto.languageId },
    });
    if (language != null) {
      return this.prisma.ethnicGroup
        .update({
          data: {
            name: dto.name,
            languageId: dto.languageId,
          },
          where: {
            id: id,
          },
        })
        .catch((error) => {
          PrintNameAndCodePrismaException(error, this.logger);
          if (error instanceof PrismaClientKnownRequestError) {
            if (error.code == 'P2002') {
              throw new HttpException(
                'этническая группа с таким названием уже существует или язык этнической группы уже закреплен за этнической группой',
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
    throw new HttpException(
      'выбранного языка не существует',
      HttpStatus.FORBIDDEN,
    );
  }

  async deleteEthnicGroup(id: number) {
    this.logger.debug('DELETE ETHNIC GROUP');
    return this.prisma.ethnicGroup
      .delete({
        where: { id: id },
      })
      .then()
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        if (error.code === 'P2025') {
          throw new HttpException(
            'выбранной этнической группы не существует',
            HttpStatus.FORBIDDEN,
          );
        }
        throw new HttpException(
          this.msgException.UnhandledError,
          HttpStatus.BAD_GATEWAY,
        );
      });
  }

  async addLanguage(dto: AddLanguageDto): Promise<LanguageDto> {
    this.logger.debug('ADD LANGUAGE');
    return this.prisma.language
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
              'выбранный язык этнической группы с таким названием уже существует',
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

  async getLanguages(): Promise<LanguageDto[]> {
    this.logger.debug('GET LANGUAGES');
    return this.prisma.language.findMany();
  }

  async deleteLanguageById(id: number) {
    this.logger.debug('DELETE LANGUAGE BY ID');
    return this.prisma.language
      .delete({
        where: {
          id: id,
        },
      })
      .catch((error) => {
        PrintNameAndCodePrismaException(error, this.logger);
        if (error.code === 'P2025') {
          throw new HttpException(
            'выбранного языка не существует',
            HttpStatus.FORBIDDEN,
          );
        }
        if (error.code === 'P2003') {
          throw new HttpException(
            'выбранный язык связан с этнической группой',
            HttpStatus.FORBIDDEN,
          );
        }
        throw new HttpException(
          this.msgException.UnhandledError,
          HttpStatus.BAD_GATEWAY,
        );
      });
  }
}
