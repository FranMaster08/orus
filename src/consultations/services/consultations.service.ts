import {
  Injectable,
  NotFoundException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType } from '../../role/roletype.enum';
import { Repository } from 'typeorm';
// import * as moment from 'moment';
import { CancelConsultationDto } from '../dto/cancel-consultation.dto';
import { CreateConsultationDto } from '../dto/create-consultation.dto';
import { RescheduleConsultationDto } from '../dto/reschedule-consultation.dto';
import { UpdateConsultationDto } from '../dto/update-consultation.dto';
import { ConsultationsEntity } from '../entities/consultations.entity';
import { ConsultationsStatus } from '../enum/consultations-status.enum';
import { IConsultation } from '../../shared/interfaces/consultations.interfaces';
import { NotifyService } from 'src/notify/services/notify.service';

@Injectable()
export class ConsultationsService {
  logger = new Logger(ConsultationsService.name);

  constructor(
    @InjectRepository(ConsultationsEntity, 'thv-db')
    private readonly consultationsRepository: Repository<ConsultationsEntity>,
    // @Inject(forwardRef(() => NotifyService))
    private readonly notifyService: NotifyService,
  ) {}

  async createConsultation(
    data: CreateConsultationDto,
  ): Promise<ConsultationsEntity> {
    this.logger.log('BEGIN [createConsultation] ' + JSON.stringify(data));

    const newConsultation = new ConsultationsEntity();
    newConsultation.doctorId = data.doctorId;
    newConsultation.patientId = data.patientId;
    newConsultation.status = data.status;
    newConsultation.type = data.type;
    newConsultation.family_id = data.familyId;
    newConsultation.date = data.date;
    newConsultation.observations = JSON.stringify(data.observations);
    newConsultation.prescriptions = JSON.stringify(data.prescriptions);
    newConsultation.exams = JSON.stringify(data.exams);
    newConsultation.quote = JSON.stringify(data.quote);

    const saveConsultation = await this.consultationsRepository.save(
      newConsultation,
    );
    const getConsultation = await this.consultationsRepository.findOne(
      saveConsultation.id,
      { relations: ['patient'] },
    );

    // le saque el async para que no se tardara tanto en la respuesta
    this.notifyService.notifyConsultationAtendded();

    return getConsultation;

    // TODO: enviar mail creada exitosamente la consulta
    // TODO: verificar si hay una consulta para esa misma fecha y horario
    // TODO: verificar si el paciente tiene 2 consultas por atender, solo puede tener 2 por atender
  }

  async getConsultations(role: RoleType, id: string): Promise<IConsultation[]> {
    let consultations: IConsultation[];
    if (role === RoleType.DOCTOR) {
      consultations = await this.consultationsRepository.find({
        select: ['id', 'date', 'status', 'type', 'observations'],
        where: { doctorId: id },
        relations: ['patient'],
        order: { date: 'ASC' },
      });

      consultations = consultations.map((consultation) => ({
        id: consultation.id,
        date: consultation.date,
        status: consultation.status,
        type: consultation.type,
        patient: consultation.patient,
        observations: consultation.observations,
      }));
    } else if (role === RoleType.PATIENT) {
      consultations = await this.consultationsRepository.find({
        where: { patientId: id },
      });
    } else if (role === RoleType.ADMIN) {
      consultations = await this.consultationsRepository.find();
    }

    return consultations;
  }

  async updateConsultation(
    id: string,
    data: UpdateConsultationDto,
  ): Promise<ConsultationsEntity> {
    this.logger.log(
      `BEGIN [${this.updateConsultation.name}] Params[id: string = ${id}]`,
    );

    if (!(await this.consultationsRepository.findOne(id))) {
      throw new NotFoundException('Medical consultation not found');
    }

    await this.consultationsRepository.update(id, {
      status: ConsultationsStatus.ATTENDED,
      observations: JSON.stringify(data.observations),
      prescriptions: JSON.stringify(data.prescriptions),
      exams: JSON.stringify(data.exams),
      quote: JSON.stringify(data.quote),
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
    this.logger.log(
      `BEGIN [${this.cancelConsultation.name}] Params[id: string = ${id}]`,
    );

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
  ): Promise<IConsultation> {
    this.logger.log(
      `BEGIN [${this.rescheduleConsultation.name}] Params[id: string = ${id}]`,
    );

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

  async findOne(id: string): Promise<ConsultationsEntity> {
    const consultation = await this.consultationsRepository.findOne(id);
    if (!consultation) {
      throw new NotFoundException('Medical consultation not found');
    }
    return consultation;
  }
}
