import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class CreateUsuariosDto {
  @IsNotEmpty()
  @IsString()
  readonly first_name: string;

  @IsString()
  readonly last_name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
