import { Controller, Post, Body } from '@nestjs/common';
import { LoginRequest } from '../core/models/requests/login.request';
import { RegisterRequest } from '../core/models/requests/register.request';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginRequest: LoginRequest) {
    return this.authService.login(loginRequest);
  }

  @Post('register')
  async register(@Body() registerRequest: RegisterRequest) {
    return await this.authService.register({ ...registerRequest });
  }
  // @Post('logout')
  // async logout(@Request() req) {
  //   const { id, username } = req.user as { id: string; username; string };
  //   return this.authService.logout({ id, username });
  // }
}
