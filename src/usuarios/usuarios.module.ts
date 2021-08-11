import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { UsuariosController } from './controllers/usuarios.controller';
import { UsersEntity } from './entities/usuarios.entity';
import { UsuariosService } from './services/usuarios.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([UsersEntity], 'thv-db')],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService]
})
export class UsuariosModule {}
