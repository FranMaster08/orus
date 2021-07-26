import { Controller, Get } from '@nestjs/common';
import { UsuariosService } from '../services/usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  getUsuarios() {
    console.log('object :>> ', { object: 'object' });
    this.usuariosService.getUsuarioDoctor();
    return 'eres un genio bebe 2';
  }
}
