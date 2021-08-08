import {
  Body,
  Controller,
  Post,
  UseGuards,
  Logger,
  Put,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleType } from 'src/role/roletype.enum';
import { CancelConsultationDto } from '../dto/cancel-consultation.dto';
import { CreateConsultationDto } from '../dto/create-consultation.dto';
import { RescheduleConsultationDto } from '../dto/reschedule-consultation.dto';
import { UpdateConsultationDto } from '../dto/update-consultation.dto';
import { ConsultationsEntity } from '../entities/consultations.entity';
import { ConsultationsService } from '../services/consultations.service';

@Controller('consultations')
@UseGuards(AuthGuard('jwt'))
export class ConsultationsController {
  logger = new Logger('ConsultationsController');

  constructor(private readonly consultationsService: ConsultationsService) {}

  // TODO: ya teniendo un 'paciente' y un 'doctor' se puede agendar una conuslta en estatus 'pending'
  @Post()
  async createConsultation(
    @Body() data: CreateConsultationDto,
  ): Promise<ConsultationsEntity> {
    this.logger.log('[crearConsulta] ' + JSON.stringify(data));

    return await this.consultationsService.crearConsulta(data);
  }

  // TODO: una vez creada la consulta con estatus 'PENDING' se puede antenter
  @Put(':id')
  async updateConsultation(
    @Param('id') id: string,
    @Body() data: UpdateConsultationDto,
  ): Promise<ConsultationsEntity> {
    this.logger.log('[updateConsultation] ' + id);

    return await this.consultationsService.updateConsultation(id, data);
  }

  @Put(':id/cancel-doctor')
  async cancelConsultationDoctor(
    @Param('id') id: string,
    @Body() data: CancelConsultationDto,
  ): Promise<ConsultationsEntity> {
    this.logger.log('[cancelConsultationDoctor] ' + id);

    return await this.consultationsService.cancelConsultation(
      id,
      data,
      RoleType.DOCTOR,
    );
  }

  @Put(':id/cancel-patient')
  async cancelConsultationPatient(
    @Param('id') id: string,
    @Body() data: CancelConsultationDto,
  ): Promise<ConsultationsEntity> {
    this.logger.log('[cancelConsultationPatient] ' + id);

    return await this.consultationsService.cancelConsultation(
      id,
      data,
      RoleType.PATIENT,
    );
  }

  @Put(':id/reschedule-doctor')
  async rescheduleConsultationDoctor(
    @Param('id') id: string,
    @Body() data: RescheduleConsultationDto,
  ): Promise<ConsultationsEntity> {
    this.logger.log('[rescheduleConsultationDoctor] ' + id);

    return await this.consultationsService.rescheduleConsultation(
      id,
      data,
      RoleType.DOCTOR,
    );
  }

  @Put(':id/reschedule-patient')
  async rescheduleConsultationPatient(
    @Param('id') id: string,
    @Body() data: RescheduleConsultationDto,
  ): Promise<ConsultationsEntity> {
    this.logger.log('[rescheduleConsultationPatient] ' + id);

    return await this.consultationsService.rescheduleConsultation(
      id,
      data,
      RoleType.PATIENT,
    );
  }
}
