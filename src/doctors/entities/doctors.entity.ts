
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('doctors')
export class DoctorsEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  files: string; // TODO: hacer interfaces de estructura detallada de objeto .. YA ESTA HECHA

  @Column()
  professional_backgroud: string; // TODO: hacer interfaces de estructura detallada de objeto.. YA ESTA HECHA

  @Column()
  specialty: string;

  @Column()
  collegiate_number: string;

  @Column()
  consultation_rooms: string; // TODO: hacer interfaces de estructura detallada de objeto.. YA ESTA HECHA creo

  @Column()
  insurance_companies: string; // TODO: hacer interfaces de estructura detallada de objeto,,  o lo recibe asi como string ? porque lle hace un JSON.strinfy.. YA ESTA HECHA

  @Column()
  schedule: string; // TODO: hacer interfaces de estructura detallada de objeto, enum para cada uno de los dias de la semana, ya hay en el front
  // TODO: cuando lo coloco como es: schedule: IScheduleDay[];    dice que no: Data type "Array" in "DoctorsEntity.schedule" is not supported by "mysql" database.
}
