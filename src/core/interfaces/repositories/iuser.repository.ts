import { Prisma, User } from '@prisma/client';

export abstract class IUserRepository {
  abstract createUser(data: Prisma.UserCreateInput): Promise<void>;

  abstract updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User>;

  abstract getUsers(params: { skip?: number; take?: number }): Promise<User[]>;

  abstract getUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User>;
}
