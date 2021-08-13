import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateUsuariosDto } from '../../users/dto/createUsuarios.dto';
import { LoginCredentialsDto } from '../dto/LoginCredentialsDto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() user: CreateUsuariosDto) {
    return await this.authService.signup(user);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() credentials: LoginCredentialsDto) {
    return await this.authService.login(credentials);
  }
}
