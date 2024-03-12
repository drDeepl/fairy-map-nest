import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConstituentsModule } from './constituent/constituent.module';
import { PrismaModule } from './prisma/prisma.module';
import { EthnicGroupModule } from './ethnic-group/ethnic-group.module';
import { MapModule } from './map/map.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
      cache: true,
    }),
    PrismaModule,
    UserModule,
    ConstituentsModule,
    EthnicGroupModule,
    MapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
