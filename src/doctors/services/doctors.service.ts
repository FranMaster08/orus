import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { DoctorsEntity } from '../entities/doctors.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(DoctorsEntity, 'thv-db')
    private readonly doctorsRepository: Repository<DoctorsEntity>,
  ) {}

  async createDoctor(doctorDetails: CreateDoctorDto): Promise<DoctorsEntity> {
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

    const saveDoctor = await this.doctorsRepository.save(newDoctor);

    return saveDoctor;
  }
}
