import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LibrosController } from './libros/libros.controller';
import { LibrosService } from './libros/libros.service';
// import { ConfigModule } from './config/config.module';
// import { ConfigService } from './config/config.service';
// import { Configuration } from './config/config.keys';
import { UsuariosModule } from './usuarios/usuarios.module';
import { UsuariosEntity } from './usuarios/entities/usuarios.entity';
import { AuthModule } from './auth/auth.module';
import { DoctorsModule } from './doctors/doctors.module';
import { DoctorsEntity } from './doctors/entities/doctors.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      name: 'thv-db',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [UsuariosEntity, DoctorsEntity],
      synchronize: false,
    }),
    // ConfigModule,
    UsuariosModule,
    AuthModule,
    DoctorsModule,
  ],
  controllers: [LibrosController],
  providers: [LibrosService],
})
export class AppModule {}
