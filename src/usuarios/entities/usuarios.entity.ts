import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('usuarios')
export class Usuarios {
  @PrimaryColumn()
  id: number;

  @Column()
  nombre: string;
}
