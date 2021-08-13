import { GenderType } from 'src/users/enum/gender.enum';
import { UserStatusEnum } from 'src/users/enum/user-status.enum';

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
