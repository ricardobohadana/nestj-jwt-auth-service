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

@Injectable()
export class AuthService {
  private salts: string;

  constructor(
    private configService: ConfigService,
    private readonly userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {
    this.salts = configService.get<string>('SECRET_KEY');
  }

  private hashPassword(password: string): string {
    const hashedPassword = scryptSync(password, this.salts, 64).toString('hex');
    return hashedPassword;
  }

  private comparePasswords(password: string, comparePassword: string) {
    const comparePasswordHashed = Buffer.from(
      this.hashPassword(comparePassword),
      'hex',
    );
    const storedPassword = Buffer.from(password, 'hex');
    return timingSafeEqual(storedPassword, comparePasswordHashed);
  }

  async register(registerRequest: RegisterRequest) {
    const { username, email, password } = registerRequest;
    const { passwordConfirmation, ...rest } = registerRequest;

    if (password !== passwordConfirmation) throw new BadRequestException();

    const userWithEmail = await this.userRepository.getUser({ email });
    const userWithUsername = await this.userRepository.getUser({ username });
    if (userWithEmail !== null || userWithUsername !== null)
      throw new NotAcceptableException();
    else {
      const user = {
        ...rest,
        password: this.hashPassword(password),
        isActive: true,
      };
      await this.userRepository.createUser(user);
    }
  }

  private generateAccessToken(user: User) {
    const jwtPayload = { username: user.username, sub: user.id };
    return this.jwtService.sign(jwtPayload);
  }

  private generateRefreshToken(user: User) {
    const jwtPayload = { username: user.username, sub: user.id };
    return this.jwtService.sign(jwtPayload, { expiresIn: '24h' });
  }

  async login(loginRequest: LoginRequest) {
    const { username, password, rememberMe } = loginRequest;

    const user = await this.userRepository.getUser({ username });
    if (!user) throw new UnauthorizedException();
    if (!this.comparePasswords(user.password, password))
      throw new UnauthorizedException();
    const access_token = this.generateAccessToken(user);
    if (!rememberMe) return { access_token };
    const refresh_token = this.generateRefreshToken(user);

    return { access_token, refresh_token };
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
