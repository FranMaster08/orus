import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from '../entities/usuarios.entity';
import { EspecialidadesServive } from 'src/shared/especialidades.service';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly especialidadesService: EspecialidadesServive,
    @InjectRepository(Usuarios, 'thv-db')
    private usuariosRepository: Repository<Usuarios>,
  ) {}

  getUsuarioDoctor() {
    console.log('Doctor Shapatin tiene estas especialidades: ');
    this.especialidadesService.getEspecialidades();
    this.getUsuarios();
  }

  // getUsuarios(): Promise<Usuarios[]> {
  //   return this.usuariosRepository.find();
  // }
  async getUsuarios(): Promise<void> {
    const usuarios = await this.usuariosRepository.find();
    console.log('getUsuarios :>> ', usuarios);
  }
}
