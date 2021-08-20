import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesController } from './controllers/files.controller';
import { FilesEntity } from './entities/files.entity';
import { FilesService } from './services/files.service';

@Module({
  imports: [TypeOrmModule.forFeature([FilesEntity], 'thv-db')],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
