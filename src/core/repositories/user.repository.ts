import { Injectable } from '@nestjs/common/decorators';
import { Prisma, User } from '@prisma/client';
import { IUserRepository } from '../interfaces/repositories/iuser.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<void> {
    await this.prismaService.user.create({ data });
  }
  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return await this.prismaService.user.update({ where, data });
  }

  async getUsers(params: { skip?: number; take?: number }): Promise<User[]> {
    const { skip, take } = params;
    return await this.prismaService.user.findMany({ skip, take });
  }

  async getUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
    });
    return user ? (user.isActive ? user : null) : null;
  }
}
