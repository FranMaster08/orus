import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType } from '../../role/roletype.enum';
import { IPatient } from '../../shared/interfaces/patients.interfaces';
import { UsersEntity } from '../../users/entities/users.entity';
import { GenderType } from '../../users/enum/gender.enum';
import { UserStatusEnum } from '../../users/enum/user-status.enum';
import { Repository } from 'typeorm';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(UsersEntity, 'thv-db')
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async getPatients(): Promise<IPatient[]> {
    const patientsFind = await this.usersRepository.find({
      role: RoleType.PATIENT,
    });

    const patients: IPatient[] = patientsFind.map((user) => {
      let gender = GenderType.MALE;
      if (user.gender === GenderType.FELAME) {
        gender = GenderType.FELAME;
      }
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dni: user.dni,
        status: UserStatusEnum[user.status],
        birthDate: user.birthDate,
        gender,
      };
    });
    return patients;
  }

  async getPatientById(id: string): Promise<IPatient> {
    const patient = await this.usersRepository.findOne({ id });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    delete patient.password;

    return patient;
  }
}
