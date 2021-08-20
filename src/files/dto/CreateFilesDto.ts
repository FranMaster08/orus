import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RoleType } from '../../role/roletype.enum';
import { FileExtension, FileType } from '../enum/files.enum';


class FileDto {
  @IsEnum(FileType)
  readonly type: FileType;

  @IsEnum(RoleType)
  readonly role: RoleType;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsEnum(FileExtension)
  readonly extension: FileExtension;

  @IsString()
  @IsNotEmpty()
  readonly base64: string;
}

export class CreateFilesDto {
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  @IsArray()
  @IsNotEmpty()
  readonly files: FileDto[];
}
