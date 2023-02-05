import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { IUserRepository } from '../core/interfaces/repositories/iuser.repository';
import { UserRepository } from '../core/repositories/user.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IUserPersistentTokensRepository } from '../core/interfaces/repositories/iuserPersistentTokens.repository';
import { UserPersistentTokensRepository } from '../core/repositories/userPersistentTokens.repository';
import { RefreshJwtStrategy } from './strategy/refresh-jwt.strategy';
import { UsersService } from '../users/users.service';

export const authModuleProviders = [
  ConfigService,
  PrismaService,
  AuthService,
  UsersService,
  JwtStrategy,
  RefreshJwtStrategy,
  {
    provide: IUserRepository,
    useClass: UserRepository,
  },
  {
    provide: IUserPersistentTokensRepository,
    useClass: UserPersistentTokensRepository,
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
