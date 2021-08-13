import { UsersEntity } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ConsultationsStatus } from '../enum/consultations-status.enum';
import { ConsultationsType } from '../enum/consultations-type.enum';

@Entity('consultations')
export class ConsultationsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'doctor_id' })
  doctorId: string;

  @Column({ name: 'patient_id' })
  patientId: string;

  @Column({
    type: 'enum',
    enum: ConsultationsStatus,
    default: ConsultationsStatus.PENDING,
  })
  status: ConsultationsStatus;

  @Column({
    type: 'enum',
    enum: ConsultationsType,
  })
  type: ConsultationsType;

  @Column({ name: 'family_id' })
  family_id: string;

  @Column()
  date: Date;

  @Column()
  observations: string;

  @Column()
  prescriptions: string;

  @Column()
  exams: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UsersEntity, { cascade: false, nullable: false })
  @JoinColumn({ name: 'patient_id', referencedColumnName: 'id' })
  patientData: UsersEntity;
}
