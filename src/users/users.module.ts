import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './controllers/users.controller';
import { UsersEntity } from './entities/users.entity';
import { UsuariosService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity], 'thv-db')],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService]
})
export class UsuariosModule {}
