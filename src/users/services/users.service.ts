import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entities/users.entity';
import { CreateUserDto } from '../dto/createUsers.dto';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity, 'thv-db')
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async createUser(user: CreateUserDto) {
    const exist = await this.usersRepository.count({ email: user.email });
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

    const userCreate = await this.usersRepository.create(nuevoUsuario);
    const userSave = await this.usersRepository.save(userCreate);

    // TODO: enviar email

    let createdUser = await this.usersRepository.findOne(userSave.id, {});

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

  async findOne(where: { query: {} }): Promise<UsersEntity> {
    return await this.usersRepository.findOne({ where: where.query });
  }

  async updateTokenPasswordRecovery(
    id: string,
    tokenPasswordRecovery: string,
  ): Promise<number> {
    const update = await this.usersRepository.update(id, {
      tokenPasswordRecovery,
    });
    if (update.affected) {
      return 1;
    } else {
      return 0;
    }
  }
}
