import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: { url: configService.get('prisma.url') },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    const countEthnicGroups = await this.ethnicGroup.count();

    if (countEthnicGroups === 0) {
      await this.filledDatabase();
    }
  }

  async filledDatabase() {
    const ethnicGroupsFilePath = path.join(
      __dirname,
      '..',
      'static',
      'map',
      'ethnic_groups_with_language.json',
    );

    const ethnicGroupsJson = JSON.parse(
      fs.readFileSync(ethnicGroupsFilePath, 'utf8'),
    );

    ethnicGroupsJson.forEach(async (ethnicGroup) => {
      const language = await this.language.create({
        data: {
          name: ethnicGroup.language_name,
        },
      });

      await this.ethnicGroup.create({
        data: {
          name: ethnicGroup.name,
          languageId: language.id,
        },
      });
    });
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
