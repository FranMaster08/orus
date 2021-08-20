import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entities/users.entity';
import { CreateUserDto } from '../dto/createUsuarios.dto';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(UsersEntity, 'thv-db')
    private usuariosRepository: Repository<UsersEntity>,
  ) {}

  async crearUsuario(user: CreateUserDto) {
    const exist = await this.usuariosRepository.count({ email: user.email });
    if (exist) {
      throw new ConflictException('User already exists');
    }

    const nuevoUsuario = new UsersEntity();
    nuevoUsuario.firstName = user.firstName;
    nuevoUsuario.lastName = user.lastName;
    nuevoUsuario.email = user.email;
    nuevoUsuario.dni = user.dni;
    nuevoUsuario.gender = user.gender;
    nuevoUsuario.role = user.role;
    nuevoUsuario.birthDate = user.birthDate;
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

  async findOne(query: any): Promise<UsersEntity> {
    return await this.usuariosRepository.findOne({ where: query });
  }

  async getUsuarios(): Promise<void> {
    const usuarios = await this.usuariosRepository.find();
  }
}
