import { PrismaModule } from '@/prisma/prisma.module';
import { UserModule } from '@/app/modules/user/user.module';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AccessJwtStrategy } from './strategies/access-jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'access-jwt', session: false }),
    ConfigModule,
    UserModule,
  ],
  providers: [JwtService, AccessJwtStrategy, AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
