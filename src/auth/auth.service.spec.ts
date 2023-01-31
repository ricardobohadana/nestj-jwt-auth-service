import { Test, TestingModule } from '@nestjs/testing';
import { RegisterRequest } from '../core/models/requests/register.request';
import { authModuleImports, authModuleProviders } from './auth.module';
import { AuthService } from './auth.service';
import { faker } from '@faker-js/faker';
import { LoginRequest } from '../core/models/requests/login.request';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const loginUsername = 'Raleigh36';
  const loginPassword = 'QqvPB5SYLydY2Q1fUBHj_B';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: authModuleImports,
      providers: authModuleProviders,
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should register a valid user', async () => {
    const registerRequest = new RegisterRequest();
    registerRequest.email = faker.internet.email();
    registerRequest.password = faker.internet.password(20) + '_B';
    registerRequest.passwordConfirmation = registerRequest.password;
    registerRequest.username = faker.internet.userName();
    expect(async () => await service.register(registerRequest)).not.toThrow();
  });

  it('Should login a valid user without rememberMe', async () => {
    const loginRequest = new LoginRequest();
    loginRequest.username = loginUsername;
    loginRequest.password = loginPassword;
    loginRequest.rememberMe = false;
    const response = await service.login(loginRequest);

    expect(response).toHaveProperty('access_token');
    expect(response).not.toHaveProperty('refresh_token');
  });

  it('Should login a valid user with rememberMe', async () => {
    const loginRequest = new LoginRequest();
    loginRequest.username = loginUsername;
    loginRequest.password = loginPassword;
    loginRequest.rememberMe = true;
    const response = await service.login(loginRequest);

    expect(response).toHaveProperty('access_token');
    expect(response).toHaveProperty('refresh_token');
    expect(response.access_token).not.toEqual(response.refresh_token);
  });

  it('Should not login an invalid user', async () => {
    const loginRequest = new LoginRequest();
    loginRequest.username = loginUsername + 'invalid';
    loginRequest.password = loginPassword;
    loginRequest.rememberMe = true;

    expect(async () => await service.login(loginRequest)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('Should not login a user with an invalid password', async () => {
    const loginRequest = new LoginRequest();
    loginRequest.username = loginUsername;
    loginRequest.password = loginPassword + 'invalid';
    loginRequest.rememberMe = true;

    expect(async () => await service.login(loginRequest)).rejects.toThrowError(
      UnauthorizedException,
    );
  });
});
