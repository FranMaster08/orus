import { GenderType } from '../../users/enum/gender.enum';
import { UserStatusEnum } from '../../users/enum/user-status.enum';

export interface IUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dni?: string;
  status?: UserStatusEnum;
  birthDate?: Date;
  gender?: GenderType;
  tokenPasswordRecovery?: string;
  password?: string;
}
