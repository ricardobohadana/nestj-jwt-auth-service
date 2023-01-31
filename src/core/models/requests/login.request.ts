import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class LoginRequest {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsStrongPassword({ minLength: 7, minNumbers: 1 })
  password: string;

  @IsBoolean()
  rememberMe: boolean;
}
