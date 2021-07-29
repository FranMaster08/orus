import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConsultationDto } from '../dto/create-consultation.dto';
import { ConsultationsEntity } from '../entities/consultations.entity';

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

    const saveConsultation = this.consultationsRepository.save(newConsultation)

    return saveConsultation;

    // TODO: enviar mail creada exitosamente la consulta
    // TODO: verificar si hay una consulta para esa misma fecha y horario
    // TODO: verificar si el paciente tiene 2 consultas por atender, solo puede tener 2 por atender
  }
}
