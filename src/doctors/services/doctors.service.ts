import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IScheduleDay } from '../../shared/interfaces/doctor.interfaces';
import { Repository } from 'typeorm';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { DtoScheduleDay } from '../dto/schedule-day.dto';
import { DoctorsEntity } from '../entities/doctors.entity';
import { IUser } from '../../shared/interfaces/users.interfaces';
import { GenderType } from '../../users/enum/gender.enum';
import { UsersEntity } from '../../users/entities/users.entity';
import { RoleType } from '../../role/roletype.enum';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(DoctorsEntity, 'thv-db')
    private readonly doctorsRepository: Repository<DoctorsEntity>,
    @InjectRepository(UsersEntity, 'thv-db')
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async createDoctor(doctorDetails: CreateDoctorDto): Promise<DoctorsEntity> {
    // TODO: antes de crear un doctor, verificar si existe como usuario... pues el mismo id del user es el del doctor

    const exist = await this.doctorsRepository.count({ id: doctorDetails.id });

    if (exist) {
      throw new ConflictException('Config doctor id already exists');
    }

    let newDoctor = new DoctorsEntity();
    newDoctor.id = doctorDetails.id;
    newDoctor.files = JSON.stringify(doctorDetails.files);
    newDoctor.professional_backgroud = JSON.stringify(
      doctorDetails.professional_backgroud,
    );
    newDoctor.specialty = doctorDetails.specialty;
    newDoctor.collegiate_number = doctorDetails.collegiate_number;
    newDoctor.consultation_rooms = JSON.stringify(
      doctorDetails.consultation_rooms,
    );
    newDoctor.insurance_companies = JSON.stringify(
      doctorDetails.insurance_companies,
    );
    newDoctor.schedule = JSON.stringify(doctorDetails.schedule);

    const saveDoctor = await this.doctorsRepository.save(newDoctor);

    return saveDoctor;
  }

  async getSchedule(id: string) {
    const doctor = await this.doctorsRepository.findOne(id);

    if (!doctor) {
      throw new NotFoundException('Doctor does not exist');
    }

    return JSON.parse(doctor.schedule);
  }

  async updateSchedule(id: string, schedule: DtoScheduleDay) {
    const doctor = await this.doctorsRepository.findOne(id);

    if (!doctor) {
      throw new NotFoundException('Doctor does not exist');
    }

    const doctorSchedule: IScheduleDay[] = JSON.parse(doctor.schedule).map(
      (schedule_) => {
        if (schedule_.day === schedule.day) {
          return schedule;
        }
        return schedule_;
      },
    );

    await this.doctorsRepository.update(id, {
      schedule: JSON.stringify(doctorSchedule),
    });

    return doctorSchedule;
  }

  async getDoctors(): Promise<IUser[]> {
    const find = await this.usersRepository.find({
      where: { role: RoleType.DOCTOR },
      order: { firstName: 'ASC' },
    });

    const doctors: IUser[] = find.map((user) => {
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
        status: user.status,
        birthDate: user.birthDate,
        gender,
      };
    });
    return doctors;
  }
}
