import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../../users/dto/createUsers.dto';
import { UsersEntity } from '../../users/entities/users.entity';
import { UsersService } from '../../users/services/users.service';
import { LoginCredentialsDto } from '../dto/LoginCredentialsDto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserStatusEnum } from '../../users/enum/user-status.enum';
import { v4 as uuidv4 } from 'uuid';
import { RecoveryPassByEmailDto } from '../dto/RecoveryPassByEmailDto';
import { NotifyService } from 'src/notify/services/notify.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    // @Inject(forwardRef(() => NotifyService))
    private readonly notifyService: NotifyService,
  ) {}

  async signup(user: CreateUserDto): Promise<UsersEntity> {
    return this.usersService.createUser(user);
  }

  async login(credentials: LoginCredentialsDto): Promise<any> {
    const user = await this.usersService.findOne({
      query: { email: credentials.username },
    });

    if (!user || user.status !== UserStatusEnum.ACTIVE) {
      throw new ConflictException('Invalid credentials');
    }

    let loginValid = false;

    loginValid = await this.usersService.validatePassword(
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

  async recoveryPasswordSendEmail(email: string) {
    const user = await this.usersService.findOne({
      query: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tokenPasswordRecovery = uuidv4();

    const reponseUTPR = await this.usersService.updateTokenPasswordRecovery(
      user.id,
      tokenPasswordRecovery,
    );

    if (reponseUTPR) {
      const sendMail = await this.notifyService.notifyRecoveryPasswordSendEmail(
        {
          user: { email, firstName: user.firstName, lastName: user.lastName },
          tokenPasswordRecovery: tokenPasswordRecovery,
        },
      );
      if (sendMail) {
        return {
          statusCode: 1,
          message: 'Email sent',
        };
      } else {
        return {
          statusCode: 0,
          message: 'Email has not been sent',
          error: 'Not Built',
        };
      }
    }

    return {
      statusCode: 0,
      message: 'Token has not been built',
      error: 'Not Built',
    };

    // TODO: FRONT pantalla de email
    // TODO: FRONT pantalla de recovery email con new pass and repeat new pass

    // TODO: change pass by token (async recoveryPasswordByEmail)
  }

  async recoveryPasswordByEmail(recovery: RecoveryPassByEmailDto) {
    console.log(`recovery.email`, recovery.email);
    console.log(`recovery.password`, recovery.password);
  }
}
