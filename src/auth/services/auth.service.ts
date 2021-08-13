import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUsuariosDto } from '../../users/dto/createUsuarios.dto';
import { UsersEntity } from '../../users/entities/users.entity';
import { UsuariosService } from '../../users/services/users.service';
import { LoginCredentialsDto } from '../dto/LoginCredentialsDto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserStatusEnum } from '../../users/enum/user-status.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(user: CreateUsuariosDto): Promise<UsersEntity> {
    return this.usuariosService.crearUsuario(user);
  }

  async login(credentials: LoginCredentialsDto): Promise<any> {
    const user = await this.usuariosService.findOne({
      email: credentials.username,
    });

    if (!user || user.status !== UserStatusEnum.ACTIVE) {
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

  async generateJWT(user: UsersEntity): Promise<any> {
    const jwtPayload: JwtPayload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      status: user.status,
      role: user.role,
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
