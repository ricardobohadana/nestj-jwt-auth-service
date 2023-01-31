import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterRequest {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  name?: string;

  @IsStrongPassword({ minLength: 7, minNumbers: 1 })
  password: string;

  @IsStrongPassword({ minLength: 7, minNumbers: 1 })
  passwordConfirmation: string;
}
