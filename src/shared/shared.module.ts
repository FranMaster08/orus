import { Module } from "@nestjs/common";
import { EspecialidadesServive } from "./especialidades.service";

@Module({
  // controllers: [],
  providers: [EspecialidadesServive], // servicio 
  exports: [EspecialidadesServive] // para usarlo en otros lados, por ejemplo lo usaremos en el modulo de usuarios
})
export class SharedModule {}