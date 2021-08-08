import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType } from 'src/role/roletype.enum';
import { Repository } from 'typeorm';
import { CancelConsultationDto } from '../dto/cancel-consultation.dto';
import { CreateConsultationDto } from '../dto/create-consultation.dto';
import { RescheduleConsultationDto } from '../dto/reschedule-consultation.dto';
import { UpdateConsultationDto } from '../dto/update-consultation.dto';
import { ConsultationsEntity } from '../entities/consultations.entity';
import { ConsultationsStatus } from '../enum/consultations-status.enum';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(ConsultationsEntity, 'thv-db')
    private readonly consultationsRepository: Repository<ConsultationsEntity>,
  ) {}

  async crearConsulta(
    data: CreateConsultationDto,
  ): Promise<ConsultationsEntity> {
    const newConsultation = new ConsultationsEntity();
    newConsultation.doctor_id = data.doctor_id;
    newConsultation.patient_id = data.patient_id;
    newConsultation.status = data.status;
    newConsultation.type = data.type;
    newConsultation.family_id = data.family_id;
    newConsultation.date = data.date;
    newConsultation.observations = JSON.stringify(data.observations);
    newConsultation.prescriptions = JSON.stringify(data.prescriptions);
    newConsultation.exams = JSON.stringify(data.exams);

    const saveConsultation = this.consultationsRepository.save(newConsultation);

    return saveConsultation;

    // TODO: enviar mail creada exitosamente la consulta
    // TODO: verificar si hay una consulta para esa misma fecha y horario
    // TODO: verificar si el paciente tiene 2 consultas por atender, solo puede tener 2 por atender
  }

  async updateConsultation(
    id: string,
    data: UpdateConsultationDto,
  ): Promise<ConsultationsEntity> {
    if (!(await this.consultationsRepository.findOne(id))) {
      throw new NotFoundException('Medical consultation not found');
    }

    await this.consultationsRepository.update(id, {
      status: ConsultationsStatus.ATTENDED,
      observations: JSON.stringify(data.observations),
      prescriptions: JSON.stringify(data.prescriptions),
      exams: JSON.stringify(data.exams),
    });

    return await this.consultationsRepository.findOne(id);

    // TODO: se crea informe PDF
    // TODO: se envia email con informe PDF
  }

  async cancelConsultation(
    id: string,
    data: CancelConsultationDto,
    user_rol: RoleType.PATIENT | RoleType.DOCTOR,
  ): Promise<ConsultationsEntity> {
    if (!(await this.consultationsRepository.findOne(id))) {
      throw new NotFoundException('Medical consultation not found');
    }

    let status = ConsultationsStatus.CANCELLED_ADMIN;
    if (user_rol === RoleType.PATIENT) {
      status = ConsultationsStatus.CANCELLED_PATIENT;
    } else if (user_rol === RoleType.DOCTOR) {
      status = ConsultationsStatus.CANCELLED_DOCTOR;
    }

    await this.consultationsRepository.update(id, {
      status,
      observations: JSON.stringify(data.observations),
    });

    return await this.consultationsRepository.findOne(id);

    // TODO: se crea informe PDF
    // TODO: se envia email con informe PDF
  }

  async rescheduleConsultation(
    id: string,
    data: RescheduleConsultationDto,
    user_rol: RoleType.PATIENT | RoleType.DOCTOR,
  ): Promise<ConsultationsEntity> {
    if (!(await this.consultationsRepository.findOne(id))) {
      throw new NotFoundException('Medical consultation not found');
    }

    await this.consultationsRepository.update(id, {
      date: data.date,
      status: ConsultationsStatus.PENDING,
      observations: JSON.stringify(data.observations),
    });

    return await this.consultationsRepository.findOne(id);

    // TODO: se crea informe PDF
    // TODO: se envia email con informe PDF
  }
}
