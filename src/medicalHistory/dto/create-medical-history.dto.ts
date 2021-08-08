import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateMedicalHistoryDto {
  @IsNotEmpty()
  @IsString()
  patient_id: string;

  @IsNotEmpty()
  @IsString()
  doctor_id: string;

  @IsNotEmpty()
  @IsArray()
  history: [];
}
