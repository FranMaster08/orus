import { Body, Controller, Post } from '@nestjs/common';
import { LoginCredentialsDto } from '../dto/LoginCredentialsDto';

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() body: LoginCredentialsDto ) {
    console.table(body);
  }
}
