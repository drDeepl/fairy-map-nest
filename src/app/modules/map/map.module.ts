import { Module } from '@nestjs/common';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { ConstituentsModule } from '../constituent/constituent.module';

@Module({
  imports: [ConstituentsModule],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
