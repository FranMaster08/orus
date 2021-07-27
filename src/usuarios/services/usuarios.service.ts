import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuariosEntity } from '../entities/usuarios.entity';
import { EspecialidadesServive } from '../../shared/especialidades.service';
import { CreateUsuariosDto } from '../dto/createUsuarios.dto';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly especialidadesService: EspecialidadesServive,
    @InjectRepository(UsuariosEntity, 'thv-db')
    private usuariosRepository: Repository<UsuariosEntity>,
  ) {}

  async crearUsuario(user: CreateUsuariosDto) {
    const exist = await this.usuariosRepository.count({ email: user.email });
    if (exist) {
      throw new ConflictException('User already exists');
    }

    const nuevoUsuario = new UsuariosEntity();
    nuevoUsuario.first_name = user.first_name;
    nuevoUsuario.last_name = user.last_name;
    nuevoUsuario.email = user.email;
    nuevoUsuario.password = await this.hashPassword(user.password);

    const userCreate = await this.usuariosRepository.create(nuevoUsuario);
    const userSave = await this.usuariosRepository.save(userCreate);

    // TODO: enviar email

    let createdUser = await this.usuariosRepository.findOne(userSave.id, {});

    return createdUser;
  }

  async hashPassword(password: string): Promise<string> {
    return await hash(password, 8); // FIXME: pasar el saltLength (8) a /config/auth.ts
  }

  async validatePassword(
    canditatePassword: string,
    password: string,
  ): Promise<boolean> {
    return await compare(canditatePassword, password);
  }

  async findOne(query: any): Promise<UsuariosEntity> {
    return await this.usuariosRepository.findOne({ where: query });
  }

  
  async getUsuarios(): Promise<void> {
    const usuarios = await this.usuariosRepository.find();
    console.log('getUsuarios :>> ', usuarios);
  }
}
