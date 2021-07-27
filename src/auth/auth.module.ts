import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
// import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsuariosModule,
    // PassportModule,
    JwtModule.register({
      secret: 'API_KEY', // FIXME: agregar en config auth
      signOptions: { expiresIn: '1day' }, // FIXME: agregar en config auth
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
