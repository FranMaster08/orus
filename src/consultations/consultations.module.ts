import { Module } from '@nestjs/common';
import { ConsultationsService } from './services/consultations.service';
import { ConsultationsController } from './controllers/consultations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultationsEntity } from './entities/consultations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConsultationsEntity], 'thv-db')],
  providers: [ConsultationsService],
  controllers: [ConsultationsController]
})
export class ConsultationsModule {}
