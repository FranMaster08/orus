import { ConsultationsStatus } from '../../consultations/enum/consultations-status.enum';
import { ConsultationsType } from '../../consultations/enum/consultations-type.enum';

export interface IConsultation {
  date: Date;
  status: ConsultationsStatus;
  type: ConsultationsType;
}
