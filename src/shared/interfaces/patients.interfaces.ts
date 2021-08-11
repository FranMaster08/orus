import { GenderType } from 'src/usuarios/enum/gender.enum';
import { UserStatusEnum } from 'src/usuarios/enum/user-status.enum';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  status: UserStatusEnum.ACTIVE | UserStatusEnum.BLOCKED;
  birthDate: Date;
  gender: GenderType.MALE | GenderType.FELAME;
}
