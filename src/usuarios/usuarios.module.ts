import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { UsuariosController } from './controllers/usuarios.controller';
import { Usuarios } from './entities/usuarios.entity';
import { UsuariosService } from './services/usuarios.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Usuarios], 'thv-db')],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
