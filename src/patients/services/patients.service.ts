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
import { FilesEntity } from 'src/files/entities/files.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(UsersEntity, 'thv-db')
    private readonly usersRepository: Repository<UsersEntity>,
    @InjectRepository(MedicalHistoryEntity, 'thv-db')
    private readonly medicalHistoryRepository: Repository<MedicalHistoryEntity>,
    @InjectRepository(FilesEntity, 'thv-db')
    private readonly filesRepository: Repository<FilesEntity>,
  ) {}

  async getPatients(): Promise<IPatient[]> {
    const patientsFind = await this.usersRepository.find({
      where: { role: RoleType.PATIENT },
      order: { firstName: 'ASC' },
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
        familyId: user.familyId,
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

    // TODO: consultar los files del historial clínico
    // this.filesRepository.find({
    //   where: {
    //     medicalHistoryId: history.
    //   }
    // })
    // user for para hacer un await a files, cambiar .map

    // const transformHistory: IMedicalHistory[] = history.map((history) => ({
    //   createdAt: history.createdAt,
    //   doctorId: history.doctorId,
    //   history: history.history,
    //   // TODO: adjuntar los files aqui
    // }));

    let transformHistory: IMedicalHistory[] = [];
    for (let n = 0; n < history.length; n++) {
      const searchFiles = await this.filesRepository.findOne({
        select: ['files'],
        where: {
          medicalHistoryId: history[n].id,
        },
      });

      let files = [];
      if (searchFiles) {
        files = JSON.parse(searchFiles.files);
      }

      transformHistory.push({
        createdAt: history[n].createdAt,
        doctorId: history[n].doctorId,
        history: history[n].history,
        files,
      });
    }

    return transformHistory;
  }

  async getPatientFamilyByPatientId(id: string): Promise<IPatient[]> {
    const patient = await this.usersRepository.findOne({ id });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const family = await this.usersRepository.find({ where: { familyId: id } });

    return family;
  }
}
