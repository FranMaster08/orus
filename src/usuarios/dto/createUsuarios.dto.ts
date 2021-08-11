import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { RoleType } from '../../role/roletype.enum';
import { GenderType } from '../enum/gender.enum';

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

  @IsNotEmpty()
  @IsString()
  @IsEnum(RoleType)
  readonly role: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(GenderType)
  readonly gender: string;

  @IsNotEmpty()
  @IsDateString()
  readonly birth_date: Date;
}
