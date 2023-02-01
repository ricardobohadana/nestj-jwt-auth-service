import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { IUserRepository } from '../../src/core/interfaces/repositories/iuser.repository';

@Injectable()
export class UserRepositoryMock implements IUserRepository {
  private users: User[];

  constructor() {
    this.users = [
      {
        id: '0',
        email: 'Denis67@hotmail.com',
        username: 'Beulah.Cummings',
        password:
          'fdb0077e8f7d3e0b14fd94c74c384fc4c38b1807e1fabafef7ab6ed81a98deb2c7d09c924468dda9ce8ae5c7f027f5fdbf4810c66756734c3c1bed938978a919',
        name: 'Denis',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      },
    ];
  }

  async createUser(data: Prisma.UserCreateInput): Promise<void> {
    await new Promise((resolve) => {
      const id = (this.users.length + 1).toString();
      this.users.push({
        ...data,
        id,
        name: data.name ?? null,
        createdAt: null,
        updatedAt: null,
      });
      resolve(true);
    });
  }
  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return await new Promise((resolve) => {
      const { id, email, username } = where;
      let user: User;
      if (id) user = this.users.find((u) => u.id === where.id);
      else if (email) user = this.users.find((u) => u.email === where.email);
      else if (username)
        user = this.users.find((u) => u.username === where.username);

      if (user) {
        this.users = this.users.filter((u) => u.id !== user.id);
        user = {
          id: user.id,
          createdAt: user.createdAt,
          email: data.email.toString() ?? user.email,
          isActive: true,
          name: data.name.toString() ?? user.name,
          password: data.password.toString() ?? user.password,
          updatedAt: new Date(),
          username: data.username.toString() ?? user.username,
        };
        this.users.push(user);
        return resolve(user);
      } else return resolve(null);
    });
  }
  async getUsers(params: { skip?: number; take?: number }): Promise<User[]> {
    return await new Promise((resolve) => {
      const { skip, take } = params;
      const returnArrayOfUsers = this.users.filter((u, index) => {
        const shouldReturnBySkipRule = index >= skip;
        const shouldReturnByTakeRule = index < 9 + skip;
        if (skip) {
          if (take) return shouldReturnBySkipRule && shouldReturnByTakeRule;
          return shouldReturnBySkipRule;
        }
        if (take) return shouldReturnByTakeRule;
        return true;
      });
      return resolve(returnArrayOfUsers);
    });
  }
  async getUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    return await new Promise((resolve) => {
      const { id, email, username } = userWhereUniqueInput;
      let user: User;
      if (id) user = this.users.find((u) => u.id === id);
      else if (email) user = this.users.find((u) => u.email === email);
      else if (username) user = this.users.find((u) => u.username === username);

      if (user) {
        this.users.push(user);
        return resolve(user);
      } else return resolve(null);
    });
  }
}
