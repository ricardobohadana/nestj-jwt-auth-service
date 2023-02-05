import { Injectable } from '@nestjs/common';
import { IUserPersistentTokensRepository } from '../../src/core/interfaces/repositories/iuserPersistentTokens.repository';
import { UserPersistentToken } from '../../src/core/models/entities/UserPersistentToken';

@Injectable()
export class UserPersistentTokensRepositoryMock
  implements IUserPersistentTokensRepository
{
  persistedTokens: UserPersistentToken[];
  constructor() {
    this.persistedTokens = [
      {
        id: '1',
        userId: '1',
        createdAt: new Date(),
        lastUsedAt: new Date(),
        isExpired: false,
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwidXNlcm5hbWUiOiJCZXVsYWguQ3VtbWluZ3MiLCJpYXQiOjE2NzUzODU2MjUsImV4cCI6MTY3NTk5MDQyNX0.E0IkG4b3fXtEa0egxxswFCPJxTn_1Z0g6UMoguYFGeY',
      },
    ];
  }

  async insertToken(data: { userId: string; token: string }): Promise<void> {
    const persistentToken: UserPersistentToken = {
      ...data,
      id: (this.persistedTokens.length + 1).toString(),
      createdAt: new Date(),
      lastUsedAt: new Date(),
      isExpired: false,
    };

    this.persistedTokens.push(persistentToken);
  }

  async setTokenAsExpired(token: string): Promise<void> {
    this.persistedTokens = this.persistedTokens.map((t) => {
      if (t.token === token) t.isExpired = true;
      return t;
    });
  }

  async checkIfTokenIsExpired(token: string): Promise<boolean> {
    return this.persistedTokens.find((t) => t.token === token).isExpired;
  }

  async removeExpiredTokens(): Promise<number> {
    const currentLength = this.persistedTokens.length;
    this.persistedTokens = this.persistedTokens.filter((t) => !t.isExpired);
    return currentLength - this.persistedTokens.length;
  }
}
