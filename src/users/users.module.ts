import { Module } from '@nestjs/common';
import { IUserRepository } from '../core/interfaces/repositories/iuser.repository';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from '../core/repositories/user.repository';
import { UsersService } from './users.service';

export const usersModuleProviders = [
  PrismaService,
  UsersService,
  {
    provide: IUserRepository,
    useClass: UserRepository,
  },
];

@Module({
  imports: [],
  controllers: [],
  providers: usersModuleProviders,
})
export class UsersModule {}
