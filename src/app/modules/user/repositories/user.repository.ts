import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: { email: email },
    });
  }

  async findUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id: id } });
  }
}
