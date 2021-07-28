import { IsArray, IsJSON, IsNotEmpty, IsObject, IsString } from 'class-validator';

interface Files {
  profile_picture: string;
}

interface ProfessionalBackgroud {
  experience: string[];
  academic_studies: string[];
}

export class CreateDoctorDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsObject()
  files: Files;

  @IsObject()
  professional_backgroud: ProfessionalBackgroud;

  @IsNotEmpty()
  @IsString()
  specialty: string;

  @IsNotEmpty()
  @IsString()
  collegiate_number: string;

  @IsArray()
  consultation_rooms: string[]

  @IsArray()
  insurance_companies: string[]
}
