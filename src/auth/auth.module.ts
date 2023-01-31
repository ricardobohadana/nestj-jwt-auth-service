import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategy/jwt.strategy';
import { IUserRepository } from '../core/interfaces/repositories/iuser.repository';
import { UserRepository } from '../repositories/user.repository';
import { PrismaService } from '../prisma/prisma.service';

export const authModuleProviders = [
  PrismaService,
  AuthService,
  JwtStrategy,
  {
    provide: IUserRepository,
    useClass: UserRepository,
  },
];

export const authModuleImports = [
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '60s' },
  }),
];

@Module({
  controllers: [AuthController],
  imports: authModuleImports,
  providers: authModuleProviders,
})
export class AuthModule {}
