import { MessageResponseDto } from '../../../../common/dto/response/message.response.dto';

import { MessageException } from '@/util/MessageException';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { UserResponseDto } from '../dto/response/user.response.dto';
import { User } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger('USERS.SERVICE');
  private readonly msgException = new MessageException();

  constructor(private readonly userRepository: UserRepository) {}

  async findUsers(): Promise<UserResponseDto[]> {
    const users: User[] = await this.userRepository.findUsers();

    return users.map((user: User) => new UserResponseDto(user));
  }

  async findById(userId: number): Promise<UserResponseDto> {
    this.logger.verbose('findById');

    const user: User | undefined = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('пользователь не найден');
    }
    return new UserResponseDto(user);
  }

  async findUserByEmail(email: string): Promise<UserResponseDto | undefined> {
    const user: User | undefined = await this.userRepository.findByEmail(email);

    return !user ? undefined : new UserResponseDto(user);
  }

  async deleteUser(userId: number): Promise<MessageResponseDto> {
    this.logger.verbose('deleteUser');

    const user: User | undefined = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('пользователь не найден');
    }

    await this.userRepository.deleteById(userId);
    return new MessageResponseDto('пользователь удален');
  }
}
