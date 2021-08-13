import { Controller } from '@nestjs/common';
import { UsuariosService } from '../services/users.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  
}
