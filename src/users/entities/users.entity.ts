import { RoleType } from '../../role/roletype.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserStatusEnum } from '../enum/user-status.enum';
import { GenderType } from '../enum/gender.enum';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;

  @Column()
  dni: string;

  @Column()
  passport: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
  })
  status: UserStatusEnum;

  @Column({
    type: 'enum',
    enum: RoleType,
  })
  role: string;

  @Column({
    type: 'enum',
    enum: GenderType,
  })
  gender: GenderType;

  @Column({ name: 'birth_date' })
  birthDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
