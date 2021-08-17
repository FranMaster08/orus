import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType } from '../../role/roletype.enum';
import { IPatient } from '../../shared/interfaces/patients.interfaces';
import { UsersEntity } from '../../users/entities/users.entity';
import { GenderType } from '../../users/enum/gender.enum';
import { UserStatusEnum } from '../../users/enum/user-status.enum';
import { Repository } from 'typeorm';
import { IMedicalHistory } from '../../shared/interfaces/medical-history.interfaces';
import { MedicalHistoryEntity } from '../../medicalHistory/entities/medical-history.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(UsersEntity, 'thv-db')
    private readonly usersRepository: Repository<UsersEntity>,
    @InjectRepository(MedicalHistoryEntity, 'thv-db')
    private readonly medicalHistoryRepository: Repository<MedicalHistoryEntity>,
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

  async getMedicalHistory(id: string): Promise<IMedicalHistory[]> {
    const history = await this.medicalHistoryRepository.find({
      where: { patientId: id },
      order: { createdAt: 'DESC' },
    });

    if (history.length < 1) {
      throw new NotFoundException(
        'The patient does not have a medical history created',
      );
    }

    const transformHistory: IMedicalHistory[] = history.map((history) => ({
      createdAt: history.createdAt,
      doctorId: history.doctorId,
      history: history.history,
    }));

    return transformHistory;
  }
}
