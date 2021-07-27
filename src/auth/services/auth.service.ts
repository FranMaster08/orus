import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUsuariosDto } from 'src/usuarios/dto/createUsuarios.dto';
import { UsuariosEntity } from 'src/usuarios/entities/usuarios.entity';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { LoginCredentialsDto } from '../dto/LoginCredentialsDto';

@Injectable()
export class AuthService {
  constructor(private readonly usuariosService: UsuariosService) {}

  async signup(user: CreateUsuariosDto): Promise<UsuariosEntity> {
    return this.usuariosService.crearUsuario(user);
  }

  async login(credentials: LoginCredentialsDto): Promise<any> {
    const user = await this.usuariosService.findOne({
      email: credentials.username,
    });

    if (!user || user.status !== 'active') {
      throw new ConflictException('Invalid credentials');
    }

    return { user };
  }
}
