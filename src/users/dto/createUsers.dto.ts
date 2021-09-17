import { Transform } from 'class-transformer';
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

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  // @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @Transform(({ value }) => (value ? value.trim() : value))
  @IsString()
  readonly dni: string;

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

  @IsString()
  readonly familyId: string;
}
