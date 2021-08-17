import { Module } from '@nestjs/common';
import { PatientsService } from './services/patients.service';
import { PatientsController } from './controllers/patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../users/entities/users.entity';
import { MedicalHistoryEntity } from '../medicalHistory/entities/medical-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity], 'thv-db'),
    TypeOrmModule.forFeature([MedicalHistoryEntity], 'thv-db'),
  ],
  providers: [PatientsService],
  controllers: [PatientsController],
})
export class PatientsModule {}
