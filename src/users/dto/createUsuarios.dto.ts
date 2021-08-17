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
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

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
  readonly role: RoleType;

  @IsNotEmpty()
  @IsString()
  @IsEnum(GenderType)
  readonly gender: GenderType;

  @IsNotEmpty()
  @IsDateString()
  readonly birthDate: Date;
}