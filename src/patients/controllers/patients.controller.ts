import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IPatient } from 'src/shared/interfaces/patients.interfaces';
import { PatientsService } from '../services/patients.service';

@Controller('patients')
@UseGuards(AuthGuard('jwt'))
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  async getPatients(): Promise<IPatient[]> {
    return await this.patientsService.getPatients();
  }

  @Get(':id')
  async getPatient(@Param('id') id: string): Promise<IPatient> {
    return await this.patientsService.getPatientById(id);
  }
}
