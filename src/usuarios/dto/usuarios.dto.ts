import { IsNotEmpty } from "class-validator";
import { RoleType } from "src/role/roletype.enum";

export class UsuariosDto {
  @IsNotEmpty()
  nombre: string;


  roles: RoleType[]
}