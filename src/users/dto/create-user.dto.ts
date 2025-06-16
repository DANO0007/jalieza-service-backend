import { IsBoolean, IsInt, IsString } from "class-validator";

export class CreateUserDto {

    @IsString()
    nombre_usuario: string;

    @IsString()
    contrasena:string;

    @IsInt()
    id_rol:number;

    @IsBoolean()
    activo: boolean;

}
