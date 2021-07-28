import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('doctors')
export class DoctorsEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  files: string; // TODO: hacer interfaces de estructura detallada de objeto

  @Column()
  professional_backgroud: string; // TODO: hacer interfaces de estructura detallada de objeto

  @Column()
  specialty: string;

  @Column()
  collegiate_number: string;

  @Column()
  consultation_rooms: string; // TODO: hacer interfaces de estructura detallada de objeto

  @Column()
  insurance_companies: string; // TODO: hacer interfaces de estructura detallada de objeto
}
