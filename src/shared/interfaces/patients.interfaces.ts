import { GenderType } from 'src/usuarios/enum/gender.enum';
import { UserStatusEnum } from 'src/usuarios/enum/user-status.enum';

export interface IPatient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  status: UserStatusEnum;
  birthDate: Date;
  gender: GenderType;
}
