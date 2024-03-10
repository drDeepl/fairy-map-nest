import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConstituentsModule } from './constituent/constituent.module';
import { PrismaModule } from './prisma/prisma.module';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
