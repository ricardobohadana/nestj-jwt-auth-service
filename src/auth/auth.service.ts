import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../core/interfaces/repositories/iuser.repository';
import { RegisterRequest } from '../core/models/requests/register.request';
import { scryptSync, timingSafeEqual } from 'node:crypto';
import { LoginRequest } from '../core/models/requests/login.request';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { User } from '../core/models/entities/User';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../core/models/helpers/jwt.payload';
import { IUserPersistentTokensRepository } from '../core/interfaces/repositories/iuserPersistentTokens.repository';
import { Request } from 'express';

@Injectable()
export class AuthService {
  private salts: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: IUserRepository,
    private readonly userPersistentTokensRepository: IUserPersistentTokensRepository,
    private readonly jwtService: JwtService,
  ) {
    this.salts = this.configService.get<string>('SECRET_KEY');
  }

  private hashPassword(password: string): string {
    const hashedPassword = scryptSync(password, this.salts, 64).toString('hex');
    return hashedPassword;
  }
  private async persistRefreshToken(params: { userId: string; token: string }) {
    await this.userPersistentTokensRepository.insertToken(params);
  }

  private generateAccessToken(user: User) {
    const { username, id } = user;
    const jwtPayload = JwtPayload.tokenPayload({ username, id });
    return this.jwtService.sign(jwtPayload);
  }

  private async generateRefreshToken(user: User) {
    const { username, id } = user;
    const jwtPayload = JwtPayload.tokenPayload({ username, id });
    const token = this.jwtService.sign(jwtPayload, { expiresIn: '7d' });
    await this.persistRefreshToken({ token, userId: user.id });
    return token;
  }

  private comparePasswords(password: string, comparePassword: string) {
    const comparePasswordHashed = Buffer.from(
      this.hashPassword(comparePassword),
      'hex',
    );
    const storedPassword = Buffer.from(password, 'hex');
    return timingSafeEqual(storedPassword, comparePasswordHashed);
  }

  async isPersistenTokenInvalid(refreshToken: string): Promise<boolean> {
    return await this.userPersistentTokensRepository.checkIfTokenIsExpired(
      refreshToken,
    );
  }

  async register(registerRequest: RegisterRequest) {
    const { username, email, password, name, passwordConfirmation } =
      registerRequest;

    if (password !== passwordConfirmation) throw new BadRequestException();

    const userWithEmail = await this.userRepository.getUser({ email });

    const userWithUsername = await this.userRepository.getUser({ username });
    if (userWithEmail || userWithUsername) throw new NotAcceptableException();
    else {
      const user = {
        username,
        email,
        name,
        password: this.hashPassword(password),
        isActive: true,
      };
      await this.userRepository.createUser(user);
    }
    return;
  }

  async login(loginRequest: LoginRequest) {
    const { username, password, rememberMe } = loginRequest;

    const user = await this.userRepository.getUser({ username });

    if (!user) throw new UnauthorizedException();

    if (!this.comparePasswords(user.password, password))
      throw new UnauthorizedException();

    const access_token = this.generateAccessToken(user);

    if (!rememberMe) return { access_token };

    const refresh_token = await this.generateRefreshToken(user);

    return { access_token, refresh_token };
  }

  async logout(token: string) {
    await this.userPersistentTokensRepository.setTokenAsExpired(token);
  }

  refreshAccessToken(user: User) {
    return this.generateAccessToken(user);
  }

  // async validateUser(username: string, pass: string): Promise<any> {
  //   const user = await this.userRepository.getUser({ username });
  //   if (user && user.password === pass) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  // async login(user: User) {
  //   const payload = { username: user.username, sub: user.id };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }
}
