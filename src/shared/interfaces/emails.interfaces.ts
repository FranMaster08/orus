import { GenderType } from 'src/users/enum/gender.enum';
import { ConsultationsType } from '../../consultations/enum/consultations-type.enum';

export interface IEmailConsultationAttended {
  id: string;
  date: string;
  patient: {
    firstName: string;
    lastName: string;
  };
  doctor: {
    firstName: string;
    lastName: string;
    gender: GenderType
  };
}
