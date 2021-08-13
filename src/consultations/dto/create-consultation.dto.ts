import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ConsultationsStatus } from '../enum/consultations-status.enum';
import { ConsultationsType } from '../enum/consultations-type.enum';

export class CreateConsultationDto {
  @IsNotEmpty()
  @IsString()
  doctorId: string;

  @IsNotEmpty()
  @IsString()
  patientId: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(ConsultationsStatus)
  status: ConsultationsStatus;

  @IsNotEmpty()
  @IsString()
  @IsEnum(ConsultationsType)
  type: ConsultationsType;

  @IsString()
  familyId: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsArray()
  observations: any; // TODO: crear tipo como corresponde

  @IsArray()
  prescriptions: any; // TODO: crear tipo como corresponde

  @IsArray()
  exams: any; // TODO: crear tipo como corresponde
}
