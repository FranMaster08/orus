import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InsertarLibrosDto } from './dto/insertar.libros.dto';
import { ResponseDto } from './dto/response.dto';
import LibroInterfaz from './interfaces/libros.interfaces';
import { LibrosService } from './libros.service';

@Controller('libros')
export class LibrosController {
  constructor(
    private librosService: LibrosService,
    private librosService2: LibrosService,
  ) {}

  @Get()
  getLibros(): ResponseDto {
    return this.librosService2.obtenerLibros();
  }

  @Get(':id')
  async getLibro(@Param('id') id: string) {
    return await this.librosService.obtenerLibro(id);
  }

  @Post()
  insertarLibro(
    @Body() payload: InsertarLibrosDto,
  ): InsertarLibrosDto | string {
    if (this.librosService.insertarLibro(payload) === 1) {
      return payload;
    } else {
      return 'No insertado';
    }
  }

  @Put(':id')
  updateLibros(@Param('id') id: string, @Body() payload): ResponseDto {
    return this.librosService.actualizarLibro(parseInt(id), payload);
  }

  @Delete(':id')
  deleteBook(@Param('id') id: string): ResponseDto {
    return this.librosService2.eliminarLibro(parseInt(id));
  }
}
