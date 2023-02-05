import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IUserPersistentTokensRepository } from '../interfaces/repositories/iuserPersistentTokens.repository';

@Injectable()
export class UserPersistentTokensRepository
  implements IUserPersistentTokensRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async insertToken(data: { userId: string; token: string }): Promise<void> {
    await this.prismaService.userPersistentTokens.create({ data });
  }

  async setTokenAsExpired(token: string): Promise<void> {
    await this.prismaService.userPersistentTokens.update({
      where: { token },
      data: {
        lastUsedAt: new Date(),
        isExpired: true,
      },
    });
  }

  async checkIfTokenIsExpired(token: string): Promise<boolean> {
    const persistedToken = await this.prismaService.userPersistentTokens.update(
      {
        where: { token: token },
        data: {
          lastUsedAt: new Date(),
        },
      },
    );
    return persistedToken ? persistedToken.isExpired : true;
  }

  async removeExpiredTokens(): Promise<number> {
    const result = await this.prismaService.userPersistentTokens.deleteMany({
      where: {
        isExpired: true,
      },
    });

    return result.count;
  }
}
