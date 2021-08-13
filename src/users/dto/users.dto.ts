import { IsNotEmpty } from "class-validator";
import { RoleType } from "../../role/roletype.enum";

// NO SE USA

export class UsuariosDto {
  @IsNotEmpty()
  nombre: string;


  roles: RoleType[]
}