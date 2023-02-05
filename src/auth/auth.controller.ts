import { Controller, Post, Body, Request } from '@nestjs/common';
import { Get, UseGuards } from '@nestjs/common/decorators';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Request as RequestType } from 'express';
import { LoginRequest } from '../core/models/requests/login.request';
import { RegisterRequest } from '../core/models/requests/register.request';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RefreshJwtAuthGuard } from './guard/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginRequest: LoginRequest) {
    return await this.authService.login(loginRequest);
  }

  @Post('register')
  async register(@Body() registerRequest: RegisterRequest) {
    return await this.authService.register({ ...registerRequest });
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: RequestType) {
    const { id } = req.user;
    return await this.authService.logout(id);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Get('refresh-access')
  refreshAccessToken(@Request() req: RequestType) {
    if (!req.user) throw new UnauthorizedException();
    return this.authService.refreshAccessToken(req.user);
  }
}
