import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../core/interfaces/repositories/iuser.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: IUserRepository) {}

  async findByUniqueValue(uniqueKeys: {
    id?: string;
    username?: string;
    email?: string;
  }) {
    return await this.userRepository.getUser({ ...uniqueKeys });
  }
}
