import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { DoctorsEntity } from '../entities/doctors.entity';
import { DoctorsService } from '../services/doctors.service';

@Controller('doctors')
@UseGuards(AuthGuard('jwt'))
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  async createDoctor(
    @Body() doctorDetails: CreateDoctorDto,
  ): Promise<DoctorsEntity> {
    return await this.doctorsService.createDoctor(doctorDetails);
  }

  @Get(':id/schedule')
  async getSchedule(@Param('id') id: string) {
    return await this.doctorsService.getSchedule(id);
  }
}
