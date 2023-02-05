import { Test, TestingModule } from '@nestjs/testing';
import { RegisterRequest } from '../core/models/requests/register.request';
import { authModuleImports } from './auth.module';
import { AuthService } from './auth.service';
import { faker } from '@faker-js/faker';
import { LoginRequest } from '../core/models/requests/login.request';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { IUserRepository } from '../core/interfaces/repositories/iuser.repository';
import { UserRepositoryMock } from '../../test/mocks/user.repository.mock';
import { IUserPersistentTokensRepository } from '../core/interfaces/repositories/iuserPersistentTokens.repository';
import { UserPersistentTokensRepositoryMock } from '../../test/mocks/userPersistentTokens.repository.mock';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  const loginUsername = 'Beulah.Cummings';
  const loginPassword = 'EDFXyY16mMx53KJtP3z5_B1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: authModuleImports,
      providers: [
        ConfigService,
        PrismaService,
        AuthService,
        UsersService,
        JwtStrategy,
        {
          provide: IUserRepository,
          useClass: UserRepositoryMock,
        },
        {
          provide: IUserPersistentTokensRepository,
          useClass: UserPersistentTokensRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should register a valid user', async () => {
    const registerRequest = new RegisterRequest();
    registerRequest.email = faker.internet.email();
    registerRequest.password = faker.internet.password(20) + '_B1';
    registerRequest.passwordConfirmation = registerRequest.password;
    registerRequest.username = faker.internet.userName();
    expect(async () => await service.register(registerRequest)).not.toThrow();
  });

  it('Should authenticate a valid user without rememberMe', async () => {
    const loginRequest = new LoginRequest();
    loginRequest.username = loginUsername;
    loginRequest.password = loginPassword;
    loginRequest.rememberMe = false;
    const response = await service.login(loginRequest);

    expect(response).toHaveProperty('access_token');
    expect(response).not.toHaveProperty('refresh_token');
  });

  it('Should authenticate a valid user with rememberMe', async () => {
    const loginRequest = new LoginRequest();
    loginRequest.username = loginUsername;
    loginRequest.password = loginPassword;
    loginRequest.rememberMe = true;
    const response = await service.login(loginRequest);

    expect(response).toHaveProperty('access_token');
    expect(response).toHaveProperty('refresh_token');
    expect(response.access_token).not.toEqual(response.refresh_token);
  });

  it('Should not authenticate an invalid user', async () => {
    const loginRequest = new LoginRequest();
    loginRequest.username = loginUsername + 'invalid';
    loginRequest.password = loginPassword;
    loginRequest.rememberMe = true;

    expect(async () => await service.login(loginRequest)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('Should not authenticate an user with an invalid password', async () => {
    const loginRequest = new LoginRequest();
    loginRequest.username = loginUsername;
    loginRequest.password = loginPassword + 'invalid';
    loginRequest.rememberMe = true;

    expect(async () => await service.login(loginRequest)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  // it('Should issue a new access_token given a valid refresh_token', async () => {
  //   const refreshToken =
  //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwidXNlcm5hbWUiOiJCZXVsYWguQ3VtbWluZ3MiLCJpYXQiOjE2NzUzODU2MjUsImV4cCI6MTY3NTk5MDQyNX0.E0IkG4b3fXtEa0egxxswFCPJxTn_1Z0g6UMoguYFGeY';

  // });
});
