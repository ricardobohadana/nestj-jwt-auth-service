import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../core/interfaces/repositories/iuser.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: IUserRepository) {}

  async findByUsername(username: string) {
    return await this.userRepository.getUser({ username });
  }
}
