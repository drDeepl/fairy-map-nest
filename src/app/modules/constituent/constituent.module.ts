import { Module } from '@nestjs/common';
import { ConstituentsService } from './services/constituent.service';
import { ConstituentsController } from './controllers/constituent.controller';

@Module({
  providers: [ConstituentsService],
  controllers: [ConstituentsController],
  exports: [ConstituentsService],
})
export class ConstituentsModule {}
