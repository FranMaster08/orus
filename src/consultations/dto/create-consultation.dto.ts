import {
  IsArray,
  IsDate,
  IsDateString,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';
import { ConsultationsStatus } from '../enum/consultations-status.enum';
import { ConsultationsType } from '../enum/consultations-type.enum';

export class CreateConsultationDto {
  @IsNotEmpty()
  @IsString()
  doctor_id: string;

  @IsNotEmpty()
  @IsString()
  patient_id: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(ConsultationsStatus)
  status: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(ConsultationsType)
  type: string;

  @IsString()
  family_id: string;

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
