export default interface LibroInterfaz {
  id: number;
  nombre: string;
  edad: number;
  activo: boolean;
  genero: string;
  realizaDeporte: string;
  fechaNacimiento: string;
}

export class LibroDto {
  id: number;
  nombre: string;
  edad: number;
  activo: boolean;
  genero: string;
  realizaDeporte: string;
  fechaNacimiento: string;
}