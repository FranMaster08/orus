import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType } from 'src/role/roletype.enum';
import { Patient } from 'src/shared/interfaces/patients.interfaces';
import { UsersEntity } from 'src/usuarios/entities/usuarios.entity';
import { GenderType } from 'src/usuarios/enum/gender.enum';
import { UserStatusEnum } from 'src/usuarios/enum/user-status.enum';
import { Repository } from 'typeorm';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(UsersEntity, 'thv-db')
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async getPatients(): Promise<Patient[]> {
    const patientsFind = await this.usersRepository.find({
      role: RoleType.PATIENT,
    });

    const patients: Patient[] = patientsFind.map((user) => {
     
      let gender = GenderType.MALE;
      if (user.gender === GenderType.FELAME) {
        gender = GenderType.FELAME;
      }
      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        dni: user.dni,
        status: UserStatusEnum[user.status],
        birthDate: user.birth_date,
        gender,
      };
    });

    return patients;
  }
}
