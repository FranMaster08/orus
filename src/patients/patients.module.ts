import { Module } from '@nestjs/common';
import { PatientsService } from './services/patients.service';
import { PatientsController } from './controllers/patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/usuarios/entities/usuarios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity], 'thv-db')],
  providers: [PatientsService],
  controllers: [PatientsController],
})
export class PatientsModule {}
