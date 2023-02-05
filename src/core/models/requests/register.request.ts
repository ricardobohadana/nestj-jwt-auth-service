import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterRequest {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsString()
  @MinLength(5)
  passwordConfirmation: string;
}
