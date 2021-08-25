import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RecoveryPassSendEmailDto {
  @Transform(({ value }) => (value ? value.toString().trim() : value))
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}

export class RecoveryPassByEmailDto {
  @Transform(({ value }) => (value ? value.toString().trim() : value))
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password?: string;
}
