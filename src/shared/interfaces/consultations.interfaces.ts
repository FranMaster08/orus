import { ConsultationsStatus } from '../../consultations/enum/consultations-status.enum';
import { ConsultationsType } from '../../consultations/enum/consultations-type.enum';
import { IPatient } from './patients.interfaces';

export interface IConsultation {
  date: Date;
  status: ConsultationsStatus;
  type: ConsultationsType;
  patientData?: IPatient
}
