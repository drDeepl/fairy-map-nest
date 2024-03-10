import { Module } from '@nestjs/common';
import { ConstituentsService } from './constituent.service';
import { ConstituentsController } from './constituent.controller';

@Module({
  providers: [ConstituentsService],
  controllers: [ConstituentsController]
})
export class ConstituentsModule {}
