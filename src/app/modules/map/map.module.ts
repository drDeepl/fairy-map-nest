import { Module } from '@nestjs/common';
import { MapController } from './controllers/map.controller';
import { MapService } from './services/map.service';
import { ConstituentsModule } from '../constituent/constituent.module';

@Module({
  imports: [ConstituentsModule],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
