import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ConsultationsStatus } from '../enum/consultations-status.enum';
import { ConsultationsType } from '../enum/consultations-type.enum';

@Entity('consultations')
export class ConsultationsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  doctor_id: string;

  @Column()
  patient_id: string;

  @Column({
    type: 'enum',
    enum: ConsultationsStatus,
    default: ConsultationsStatus.PENDING,
  })
  status: string;

  @Column({
    type: 'enum',
    enum: ConsultationsType,
  })
  type: string;

  @Column()
  family_id: string;

  @Column()
  date: Date;

  @Column()
  observations: string; // TODO: tipar

  @Column()
  prescriptions: string; // TODO: tipar

  @Column()
  exams: string; // TODO: tipar

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}
