import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType } from 'src/role/roletype.enum';
import { Patient } from 'src/shared/interfaces/patients.interfaces';
import { UsersEntity } from 'src/usuarios/entities/usuarios.entity';
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

    console.log(`patientsFind`, patientsFind);

    const patients: Patient[] = patientsFind.map((user) => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      dni: user.dni,
      status: user.status,
      birthDate: user.birth_date,
      gender: user.gender,
    }));

    //   id: string;
    // firstName: string;
    // lastName: string;
    // email: string,
    // dni: string,
    // status: UserStatusEnum,
    // birthDate: Date,
    // gender: GenderType

    // patientsFind.forEach(patient => {
    //   patient.id
    //   patients.push({
    //     id
    //   })
    // })

    return patients;
  }
}
