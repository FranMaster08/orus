import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultationsModule } from '../consultations/consultations.module';
import { FilesController } from './controllers/files.controller';
import { FilesEntity } from './entities/files.entity';
import { FilesService } from './services/files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilesEntity], 'thv-db'),
    ConsultationsModule,
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
