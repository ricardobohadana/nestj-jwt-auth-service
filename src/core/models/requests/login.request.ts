import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @IsString()
  @IsNotEmpty()
  username: string;

  password: string;

  @IsBoolean()
  rememberMe: boolean;
}
