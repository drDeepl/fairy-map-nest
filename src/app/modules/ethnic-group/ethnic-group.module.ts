import { Module } from '@nestjs/common';
import { EthnicGroupService } from './ethnic-group.service';
import { EthnicGroupController } from './ethnic-group.controller';

@Module({
  providers: [EthnicGroupService],
  controllers: [EthnicGroupController]
})
export class EthnicGroupModule {}
