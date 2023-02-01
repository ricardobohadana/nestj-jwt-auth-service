import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { IUserRepository } from '../core/interfaces/repositories/iuser.repository';
import { UserRepository } from '../repositories/user.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppModule } from '../app.module';

export const authModuleProviders = [
  ConfigService,
  PrismaService,
  AuthService,
  JwtStrategy,
  {
    provide: IUserRepository,
    useClass: UserRepository,
  },
];

export const authModuleImports = [
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      return {
        secret: configService.get<string>('SECRET_KEY') || 'test_key',
        signOptions: { expiresIn: '60s' },
      };
    },
    inject: [ConfigService],
  }),
];

@Module({
  controllers: [AuthController],
  imports: authModuleImports,
  providers: authModuleProviders,
})
export class AuthModule {}
