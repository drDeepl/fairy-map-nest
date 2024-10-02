import { MessageDto } from '@/common/dto/MessageDto';
import { PrismaService } from '@/prisma/prisma.service';
import { MessageException } from '@/util/MessageException';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserDto } from './dto/UserDto';

@Injectable()
export class UserService {
  private readonly logger = new Logger('USERS.SERVICE');
  private readonly msgException = new MessageException();

  constructor(private prisma: PrismaService) {}

  async findUsers(): Promise<UserDto[]> {
    this.logger.verbose('findUsers');
    const users: UserDto[] = await this.prisma.user.findMany();
    return users;
  }

  async findById(userId: number): Promise<UserDto> {
    this.logger.verbose('findById');

    const user: UserDto = await this.prisma.user.findUnique({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
      where: {
        id: Number(userId),
      },
    });
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async deleteUser(userId: number): Promise<MessageDto> {
    this.logger.verbose('deleteUser');
    return this.prisma.user
      .delete({ where: { id: userId } })
      .catch((error) => {
        this.logger.error(`name: ${error.name}\ncode: ${error.code}`);
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code == 'P2025') {
            throw new HttpException(
              'данного пользователя не существует',
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
      })
      .then(() => new MessageDto('пользователь удален'));
  }
}
