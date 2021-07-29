import { Body, Controller, Post, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateConsultationDto } from '../dto/create-consultation.dto';
import { ConsultationsEntity } from '../entities/consultations.entity';
import { ConsultationsService } from '../services/consultations.service';

@Controller('consultations')
@UseGuards(AuthGuard('jwt'))
export class ConsultationsController {
  logger = new Logger('ConsultationsController');

  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  async crearConsulta(
    @Body() data: CreateConsultationDto,
  ): Promise<ConsultationsEntity> {
    this.logger.log('[crearConsulta] ' + JSON.stringify(data));

    return await this.consultationsService.crearConsulta(data);
  }
}
