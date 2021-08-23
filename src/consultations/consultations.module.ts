import { Module } from '@nestjs/common';
import { ConsultationsService } from './services/consultations.service';
import { ConsultationsController } from './controllers/consultations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultationsEntity } from './entities/consultations.entity';
import { NotifyService } from '../notify/services/notify.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConsultationsEntity], 'thv-db')],
  providers: [ConsultationsService, NotifyService],
  controllers: [ConsultationsController],
  exports: [ConsultationsService]
})
export class ConsultationsModule {}
