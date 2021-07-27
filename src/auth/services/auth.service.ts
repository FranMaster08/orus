import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUsuariosDto } from '../../usuarios/dto/createUsuarios.dto';
import { UsuariosEntity } from 'src/usuarios/entities/usuarios.entity';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { LoginCredentialsDto } from '../dto/LoginCredentialsDto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

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

    let loginValid = false;

    loginValid = await this.usuariosService.validatePassword(
      credentials.password,
      user.password,
    );

    if (!loginValid) {
      throw new ConflictException('Invalid credentials');
    }

    return await this.generateJWT(user);
  }

  async generateJWT(user: UsuariosEntity): Promise<any> {
    const jwtPayload: JwtPayload = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      status: user.status,
    };

    const accessToken = this.jwtService.sign(jwtPayload, {
      issuer: 'editor', // FIXME: agregar en config auth
      expiresIn: '1day', // FIXME: agregar en config auth
    });

    return {
      token: accessToken,
      expiresIn: '1day', // FIXME: agregar en config auth
      payload: jwtPayload,
    };
  }
}
