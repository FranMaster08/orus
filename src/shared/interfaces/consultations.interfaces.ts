import { ConsultationsStatus } from '../../consultations/enum/consultations-status.enum';
import { ConsultationsType } from '../../consultations/enum/consultations-type.enum';
import { IPatient } from './patients.interfaces';

export interface IQuote {
  service: string;
  cost: number;
}

export interface IConsultation {
  id: string;
  date: Date;
  status: ConsultationsStatus;
  type: ConsultationsType;
  patient: IPatient;
  observations: string;
}
