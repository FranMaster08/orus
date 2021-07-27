import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginCredentialsDto {
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @IsNotEmpty()
  password: string;
}
