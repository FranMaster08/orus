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

  @Column()
  first_name: string;

  @Column()
  last_name: string;

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
  status: string;

  @Column({
    type: 'enum',
    enum: RoleType,
  })
  role: string;

  @Column({
    type: 'enum',
    enum: GenderType,
  })
  gender: string;

  @Column()
  birth_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
