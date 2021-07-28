import { Module } from '@nestjs/common';
import { DoctorsService } from './services/doctors.service';
import { DoctorsController } from './controllers/doctors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsEntity } from './entities/doctors.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorsEntity], 'thv-db')],
  providers: [DoctorsService],
  controllers: [DoctorsController],
  // exports: [DoctorsService]
})
export class DoctorsModule {}
