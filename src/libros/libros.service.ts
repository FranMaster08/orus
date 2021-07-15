import { Injectable } from '@nestjs/common';
import { InsertarLibrosDto } from './dto/insertar.libros.dto';
import { ResponseDto } from './dto/response.dto';
import LibroInterfaz, { LibroDto } from './interfaces/libros.interfaces';

@Injectable()
export class LibrosService {
  private readonly dataBooks: LibroInterfaz[] = [];

  insertarLibro(payload: InsertarLibrosDto) {
    try {
      const getLastId = (): number => {
        let lastId: number = 1;
        if (this.dataBooks.length > 0) {
          lastId = this.dataBooks[this.dataBooks.length - 1].id + 1;
        }
        return lastId;
      };

      this.dataBooks.push({
        id: getLastId(),
        ...payload,
      });

      return 1;
    } catch (e) {
      return 0;
    }
  }

  obtenerLibros(): ResponseDto {
    let mensaje = '';
    if (this.dataBooks.length < 1) {
      mensaje = 'No hay registros';
    } else if (this.dataBooks.length === 1) {
      mensaje = 'Hemos encontrado 1 libro';
    } else if (this.dataBooks.length > 1) {
      mensaje = `Hemos encontrado ${this.dataBooks.length} libros`;
    }

    return {
      codigo: '0',
      mensaje,
      data: this.dataBooks,
    };
  }

  obtenerLibro(id: string): ResponseDto {
    const search =
      this.dataBooks.find((book) => book.id === parseInt(id)) || '0';
    const response =
      search === '0'
        ? { codigo: '0', mensaje: 'No se encontró', data: search }
        : {
            codigo: '1',
            mensaje: `Se encontró ${[search].length} registro`,
            data: search,
          };
    return response;
  }

  actualizarLibro(id: number, data: LibroDto): ResponseDto {
    const updateDataBooks = this.dataBooks.map((libro) => {
      if (libro.id === id) {
        libro.id = id;
        libro.nombre = data.nombre;
        libro.edad = data.edad;
        libro.activo = data.activo;
        libro.genero = data.genero;
        libro.realizaDeporte = data.realizaDeporte;
        libro.fechaNacimiento = data.fechaNacimiento;
      }
      return libro;
    });

    this.dataBooks.splice(0, this.dataBooks.length);
    this.dataBooks.splice(0, updateDataBooks.length, ...updateDataBooks);
    // this.dataBooks.push(...updateDataBooks);

    return {
      codigo: '1',
      mensaje: `Libro #${id} actualizado`,
      data: { libros: this.dataBooks },
    };
  }

  eliminarLibro(id: number): ResponseDto {
    const actualizaDataBooks = this.dataBooks.filter((book) => book.id !== id);
    this.dataBooks.splice(0, this.dataBooks.length);
    this.dataBooks.push(...actualizaDataBooks);
    return {
      codigo: '1',
      mensaje: `Libro #${id} eliminado`,
      data: { libros: this.dataBooks },
    };
  }

  printResumen() {
    console.log(`this.dataBooks`, this.dataBooks.length);
    console.log(`this.dataBooks`, this.dataBooks);
    console.log();
  }
}
